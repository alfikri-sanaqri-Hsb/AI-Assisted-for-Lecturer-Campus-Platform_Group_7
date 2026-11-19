import 'dart:math' as math;

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_section_card.dart';

class TrendPoint {
  const TrendPoint({required this.label, required this.value});

  final String label;
  final double value;
}

class ProgressTrendCard extends StatelessWidget {
  const ProgressTrendCard({
    super.key,
    required this.title,
    required this.points,
    required this.emptyMessage,
    this.subtitle,
    this.color = DS.primary,
  });

  final String title;
  final String? subtitle;
  final List<TrendPoint> points;
  final String emptyMessage;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      elevated: true,
      title: title,
      children: [
        if (subtitle != null) Text(subtitle!, style: DS.caption),
        if (points.isEmpty)
          Container(
            height: 132,
            alignment: Alignment.center,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: DS.pageBackground,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Text(
              emptyMessage,
              textAlign: TextAlign.center,
              style: DS.body,
            ),
          )
        else
          SizedBox(
            height: 190,
            child: LineChart(
              LineChartData(
                minX: 0,
                maxX: math.max(1, points.length - 1).toDouble(),
                minY: 0,
                maxY: 100,
                clipData: const FlClipData.all(),
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: 25,
                  getDrawingHorizontalLine: (_) => FlLine(
                    color: DS.borderSoft,
                    strokeWidth: 1,
                    dashArray: [4, 4],
                  ),
                ),
                borderData: FlBorderData(show: false),
                titlesData: FlTitlesData(
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 34,
                      interval: 25,
                      getTitlesWidget: (value, _) => Text(
                        '${value.round()}%',
                        style: DS.caption.copyWith(fontSize: 9),
                      ),
                    ),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 28,
                      interval: _labelInterval,
                      getTitlesWidget: (value, _) {
                        final index = value.round();
                        if ((value - index).abs() > .01 ||
                            index < 0 ||
                            index >= points.length) {
                          return const SizedBox.shrink();
                        }
                        return Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            points[index].label,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: DS.caption.copyWith(fontSize: 9),
                          ),
                        );
                      },
                    ),
                  ),
                ),
                lineBarsData: [
                  LineChartBarData(
                    spots: [
                      for (final (index, point) in points.indexed)
                        FlSpot(index.toDouble(), point.value.clamp(0, 100)),
                    ],
                    isCurved: points.length > 2,
                    barWidth: 3,
                    color: color,
                    dotData: FlDotData(show: true),
                    belowBarData: BarAreaData(
                      show: true,
                      color: color.withValues(alpha: .10),
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  double get _labelInterval => points.length > 5 ? (points.length - 1) / 4 : 1;
}
