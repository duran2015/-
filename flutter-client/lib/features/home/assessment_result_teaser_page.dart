import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimens.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/app_background.dart';
import '../../core/widgets/app_nav_bar.dart';
import '../../core/widgets/app_toast.dart';
import '../order/content_order_api.dart';
import '../order/content_order_models.dart';
import '../payment/payment_view_model.dart';

/// 测评结果预览页（路由 /assessment/result-teaser）。
///
/// 测完/已测未解锁时进入：告知「深度报告已生成」，用模糊三维度雷达图
/// （焦虑 / 抑郁 / 人际关系，顶点打「?」）制造悬念，展示报告权益，
/// 底部 CTA 付费解锁完整报告（走内容订单 + 统一支付确认页）。
///
/// 免费测评或已解锁时，CTA 变为「查看完整报告」直达报告页。
class AssessmentResultTeaserPage extends ConsumerWidget {
  const AssessmentResultTeaserPage({
    super.key,
    required this.questionnaireId,
    required this.title,
    this.userAssessId,
    this.priceText = '',
  });

  final int questionnaireId;
  final String title;
  final int? userAssessId;
  final String priceText;

  bool get _isFree => priceText.isEmpty || priceText == '免费';

  /// 是否已解锁完整报告（免费测评视为已解锁）。
  bool _isUnlocked(List<ContentOrder> orders) {
    if (_isFree) return true;
    return orders.any((o) => o.refId == questionnaireId && o.isPaid);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync =
        ref.watch(contentOrderListProvider(ContentOrderBiz.assessment));
    final unlocked = ordersAsync.maybeWhen(
      data: _isUnlocked,
      orElse: () => _isFree,
    );

    return Scaffold(
      body: AppPageBackground(
        child: SafeArea(
          child: Column(
            children: [
              const AppNavBar(title: '测评结果', transparent: true),
              Expanded(
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 6, 20, 16),
                  child: Column(
                    children: [
                      const SizedBox(height: 6),
                      Text('您的深度报告已生成', style: AppTextStyles.titleXLarge),
                      const SizedBox(height: 6),
                      Text(
                        title,
                        style: AppTextStyles.body.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 18),
                      const _BlurredRadarChart(),
                      const SizedBox(height: 18),
                      _benefitCard(
                        icon: Icons.psychology_alt_outlined,
                        title: '这份报告将告诉你',
                        lines: const [
                          '识别影响你状态的潜在因素',
                          '获得针对性的调节建议',
                          '掌握可落地的自我调节方法',
                        ],
                      ),
                      const SizedBox(height: 12),
                      _benefitCard(
                        icon: Icons.lock_open_rounded,
                        title: '解锁后可查看',
                        lines: const [
                          '可视化三维度雷达图与得分解读',
                          '逐项题目的详细分析',
                          '个性化成长建议与练习推荐',
                        ],
                      ),
                      const SizedBox(height: 8),
                    ],
                  ),
                ),
              ),
              _bottomCta(context, ref, unlocked),
            ],
          ),
        ),
      ),
    );
  }

  Widget _benefitCard({
    required IconData icon,
    required String title,
    required List<String> lines,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(AppDimens.cardRadiusLarge),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: AppColors.brandTeal),
              const SizedBox(width: 8),
              Text(title, style: AppTextStyles.titleSmall),
            ],
          ),
          const SizedBox(height: 12),
          for (final line in lines) ...[
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.only(top: 7),
                  child: Icon(Icons.circle,
                      size: 5, color: AppColors.brandTeal),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    line,
                    style: AppTextStyles.body.copyWith(
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
          ],
        ],
      ),
    );
  }

  Widget _bottomCta(BuildContext context, WidgetRef ref, bool unlocked) {
    final bottomInset = MediaQuery.of(context).padding.bottom;
    return Container(
      padding: EdgeInsets.fromLTRB(20, 12, 20, 12 + bottomInset),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE2EAE6))),
      ),
      child: GestureDetector(
        onTap: () => unlocked
            ? _openReport(context)
            : _unlock(context, ref),
        child: Container(
          height: AppDimens.confirmButtonHeight,
          decoration: BoxDecoration(
            gradient: unlocked
                ? AppColors.brandGradient
                : const LinearGradient(
                    colors: [Color(0xFFFF9A56), Color(0xFFE97932)],
                  ),
            borderRadius:
                BorderRadius.circular(AppDimens.confirmButtonRadius),
          ),
          alignment: Alignment.center,
          child: Text(
            unlocked ? '查看完整报告' : '限时 $priceText 解锁详细报告',
            style: AppTextStyles.titleLarge.copyWith(color: Colors.white),
          ),
        ),
      ),
    );
  }

  /// 解锁完整报告：创建测评内容订单 → 统一支付确认页。
  Future<void> _unlock(BuildContext context, WidgetRef ref) async {
    final order = await ref.read(contentOrderApiProvider).create(
          bizType: ContentOrderBiz.assessment,
          refId: questionnaireId,
        );
    if (!context.mounted) return;
    if (order == null) {
      AppToast.show(context, '下单失败，请稍后重试');
      return;
    }
    final args = PaymentPageArgs.fromContentOrder(
      orderId: order.orderId,
      bizType: order.bizType.value,
      refId: order.refId,
      title: order.title,
      subtitle: order.subtitle,
      priceFen: order.priceFen,
      payDeadline: order.payDeadline,
    );
    await context.push(
      Uri(path: RoutePaths.payment, queryParameters: args.toQuery())
          .toString(),
    );
    // 从支付页返回：刷新订单状态（支付成功则 CTA 变为「查看完整报告」）。
    // 支付成功页 go() 换栈时本组件已卸载，先判 mounted；
    // 成功路径的缓存失效由支付成功页负责。
    if (!context.mounted) return;
    ref.invalidate(contentOrderListProvider(ContentOrderBiz.assessment));
  }

  void _openReport(BuildContext context) {
    context.push(
      Uri(path: RoutePaths.assessmentReport, queryParameters: {
        'assessmentId': '${userAssessId ?? questionnaireId}',
        'title': title,
      }).toString(),
    );
  }
}

/// 模糊三维度雷达图：同心浅三角网格 + 模糊填充三角 +
/// 顶点「?」气泡 + 维度名（焦虑 / 抑郁 / 人际关系）。
class _BlurredRadarChart extends StatelessWidget {
  const _BlurredRadarChart();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 240,
      height: 240,
      child: CustomPaint(painter: _BlurredRadarPainter()),
    );
  }
}

class _BlurredRadarPainter extends CustomPainter {
  /// 顶点方向（上 / 左下 / 右下），对应 焦虑 / 抑郁 / 人际关系。
  static const _labels = ['焦虑', '抑郁', '人际关系'];

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 34;

    Offset vertex(int i, double scale) {
      final angle = -math.pi / 2 + i * 2 * math.pi / 3;
      return center +
          Offset(math.cos(angle) * radius * scale,
              math.sin(angle) * radius * scale);
    }

    // 同心三角网格（3 层，浅灰）
    final gridPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = const Color(0xFFDDE5E1);
    for (final scale in const [1.0, 0.66, 0.33]) {
      final path = Path()
        ..moveTo(vertex(0, scale).dx, vertex(0, scale).dy)
        ..lineTo(vertex(1, scale).dx, vertex(1, scale).dy)
        ..lineTo(vertex(2, scale).dx, vertex(2, scale).dy)
        ..close();
      canvas.drawPath(path, gridPaint);
    }
    // 轴线
    for (var i = 0; i < 3; i++) {
      canvas.drawLine(center, vertex(i, 1.0), gridPaint);
    }

    // 模糊填充三角（模拟已生成但未解锁的轮廓）
    final blurPath = Path()
      ..moveTo(vertex(0, 0.72).dx, vertex(0, 0.72).dy)
      ..lineTo(vertex(1, 0.55).dx, vertex(1, 0.55).dy)
      ..lineTo(vertex(2, 0.82).dx, vertex(2, 0.82).dy)
      ..close();
    canvas.drawPath(
      blurPath,
      Paint()
        ..color = AppColors.brandTeal.withValues(alpha: 0.28)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 18),
    );
    canvas.drawPath(
      blurPath,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5
        ..color = AppColors.brandTeal.withValues(alpha: 0.35)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 6),
    );

    // 顶点「?」气泡 + 维度名
    for (var i = 0; i < 3; i++) {
      final bubbleCenter = vertex(i, 1.0);
      // 气泡白底圆
      canvas.drawCircle(
        bubbleCenter,
        13,
        Paint()..color = Colors.white,
      );
      canvas.drawCircle(
        bubbleCenter,
        13,
        Paint()
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.2
          ..color = const Color(0xFFB8C6C0),
      );
      _drawText(canvas, bubbleCenter, '?', 13, FontWeight.w800,
          const Color(0xFF8A9691));
      // 维度名（气泡外侧）
      final labelOffset = vertex(i, 1.22);
      _drawText(canvas, labelOffset, _labels[i], 12, FontWeight.w600,
          AppColors.textPrimary);
    }
  }

  void _drawText(Canvas canvas, Offset center, String text, double size,
      FontWeight weight, Color color) {
    final painter = TextPainter(
      text: TextSpan(
        text: text,
        style:
            TextStyle(fontSize: size, fontWeight: weight, color: color),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    painter.paint(
      canvas,
      center - Offset(painter.width / 2, painter.height / 2),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
