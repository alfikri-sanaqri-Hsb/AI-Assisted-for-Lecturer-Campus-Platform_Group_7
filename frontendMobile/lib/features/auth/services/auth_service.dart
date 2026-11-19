import '../../../core/network/api_client.dart';

abstract final class AuthService {
  static Future<void> login({
    required String email,
    required String password,
  }) async {
    final data = await ApiClient.postData(
      '/auth/login',
      authenticated: false,
      body: {'email': email.trim(), 'password': password},
    );
    if (data is! Map || data['token'] is! String) {
      throw const ApiException('Backend tidak mengembalikan token login.');
    }
    await ApiClient.saveToken(data['token'] as String);
  }

  static Future<void> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    await ApiClient.postData(
      '/auth/register',
      authenticated: false,
      body: {
        'full_name': fullName.trim(),
        'email': email.trim(),
        'password': password,
      },
    );
    await login(email: email, password: password);
  }

  static Future<void> logout() => ApiClient.clearToken();
}
