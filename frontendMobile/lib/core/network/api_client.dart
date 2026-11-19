import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import 'api_config.dart';

class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

abstract final class ApiClient {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'sahabat_access_token';
  static final http.Client _http = http.Client();

  static Future<String?> readToken() => _storage.read(key: _tokenKey);

  static Future<void> saveToken(String token) =>
      _storage.write(key: _tokenKey, value: token);

  static Future<void> clearToken() => _storage.delete(key: _tokenKey);

  static Future<dynamic> getData(String path, {bool authenticated = true}) =>
      _send('GET', path, authenticated: authenticated);

  static Future<dynamic> postData(
    String path, {
    Map<String, dynamic>? body,
    bool authenticated = true,
    Map<String, String>? headers,
  }) => _send(
    'POST',
    path,
    body: body,
    authenticated: authenticated,
    extraHeaders: headers,
  );

  static Future<dynamic> putData(
    String path, {
    Map<String, dynamic>? body,
    bool authenticated = true,
  }) => _send('PUT', path, body: body, authenticated: authenticated);

  static Future<dynamic> deleteData(String path) =>
      _send('DELETE', path, authenticated: true);

  static Future<dynamic> _send(
    String method,
    String path, {
    Map<String, dynamic>? body,
    required bool authenticated,
    Map<String, String>? extraHeaders,
  }) async {
    final headers = <String, String>{'Accept': 'application/json'};
    if (extraHeaders != null) headers.addAll(extraHeaders);
    if (body != null) headers['Content-Type'] = 'application/json';
    if (authenticated) {
      final token = await readToken();
      if (token == null || token.isEmpty) {
        throw const ApiException('Silakan masuk untuk menggunakan fitur ini.');
      }
      headers['Authorization'] = 'Bearer $token';
    }

    final uri = Uri.parse('${ApiConfig.baseUrl}$path');
    late final http.Response response;
    try {
      switch (method) {
        case 'GET':
          response = await _http.get(uri, headers: headers);
        case 'POST':
          response = await _http.post(
            uri,
            headers: headers,
            body: body == null ? null : jsonEncode(body),
          );
        case 'PUT':
          response = await _http.put(
            uri,
            headers: headers,
            body: body == null ? null : jsonEncode(body),
          );
        case 'DELETE':
          response = await _http.delete(uri, headers: headers);
        default:
          throw ArgumentError.value(method, 'method');
      }
    } on http.ClientException {
      throw ApiException(
        'Tidak dapat menghubungi backend di ${ApiConfig.baseUrl}. Pastikan server aktif dan alamat API benar.',
      );
    }

    dynamic decoded;
    try {
      decoded = response.body.isEmpty
          ? <String, dynamic>{}
          : jsonDecode(response.body);
    } on FormatException {
      throw ApiException(
        'Backend mengirim respons yang tidak valid.',
        statusCode: response.statusCode,
      );
    }

    final payload = decoded is Map<String, dynamic>
        ? decoded
        : <String, dynamic>{};
    if (response.statusCode == 401) await clearToken();
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final message = payload['message'];
      throw ApiException(
        message is String && message.isNotEmpty
            ? message
            : 'Permintaan gagal (${response.statusCode}).',
        statusCode: response.statusCode,
      );
    }
    return payload['data'];
  }
}
