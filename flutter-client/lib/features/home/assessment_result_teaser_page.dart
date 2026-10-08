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

/// 免费基础解读页。测评本身与本页均免费；完整解读统一 ¥9.9 解锁。
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

  bool _isUnlocked(List<ContentOrder> orders) =>
      orders.any((o) => o.refId == questionnaireId && o.isPaid);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orders = ref.watch(
      contentOrderListProvider(ContentOrderBiz.assessment),
    );
    final unlocked = orders.maybeWhen(data: _isUnlocked, orElse: () => false);
    return Scaffold(
      body: AppPageBackground(
        child: SafeArea(
          bottom: false,
          child: Column(
            children: [
              const AppNavBar(title: '基础解读', transparent: true),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(20, 4, 20, 120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _summaryCard(),
                      const SizedBox(height: 14),
                      _section(
                        title: '你目前的状态',
                        child: const Text(
                          '你的结果处于需要适度关注的范围。最近可能更容易感到紧张、疲惫，或者在事情结束后仍反复思考。你仍保有一定的自我调节能力，这也是后续改善的重要基础。',
                          style: TextStyle(
                            height: 1.65,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      _section(
                        title: '核心发现',
                        child: const Column(
                          children: [
                            _Finding(
                              icon: Icons.bolt_outlined,
                              title: '情绪反应',
                              text: '压力来临时，情绪反应可能比平时更明显。',
                            ),
                            _Finding(
                              icon: Icons.psychology_outlined,
                              title: '思维模式',
                              text: '容易预想不确定结果，较难快速停止担忧。',
                            ),
                            _Finding(
                              icon: Icons.shield_outlined,
                              title: '积极资源',
                              text: '你能够觉察自己的变化，并愿意主动寻找方法。',
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),
                      _section(
                        title: '现在可以先做什么',
                        child: Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE8F3EF),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(
                                Icons.air_rounded,
                                color: AppColors.brandTeal,
                              ),
                              SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  '先做一次 3 分钟呼吸练习，再记录此刻最困扰你的一个想法。',
                                  style: TextStyle(height: 1.55),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      _upgradeCard(),
                      const SizedBox(height: 16),
                      const Text(
                        '本结果仅供自我了解，不构成临床诊断。如状态持续或明显影响生活，建议寻求专业支持。',
                        style: TextStyle(
                          fontSize: 11,
                          height: 1.5,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _bottomCta(context, ref, unlocked),
    );
  }

  Widget _summaryCard() => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: AppTextStyles.titleLarge),
            const SizedBox(height: 18),
            const Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '62',
                  style: TextStyle(
                    fontSize: 46,
                    height: 1,
                    fontWeight: FontWeight.w800,
                    color: AppColors.indigo,
                  ),
                ),
                SizedBox(width: 8),
                Padding(
                  padding: EdgeInsets.only(bottom: 4),
                  child: Text(
                    '适度关注',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: AppColors.indigo,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              '你的状态有一些值得留意的信号，但不必急着给自己下结论。',
              style: TextStyle(height: 1.55),
            ),
          ],
        ),
      );

  Widget _section({required String title, required Widget child}) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: AppTextStyles.titleSmall),
            const SizedBox(height: 12),
            child,
          ],
        ),
      );

  Widget _upgradeCard() => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: const Color(0xFFFFF5EA),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFFFD9B8)),
        ),
        child: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '完整解读还包括',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
            ),
            SizedBox(height: 12),
            _Benefit(text: '各维度得分与详细解释'),
            _Benefit(text: '可能的影响因素与典型触发场景'),
            _Benefit(text: '你的优势、保护因素和可用资源'),
            _Benefit(text: '7 天与 30 天个性化行动计划'),
            _Benefit(text: '与你结果匹配的课程、练习和支持'),
          ],
        ),
      );

  Widget _bottomCta(BuildContext context, WidgetRef ref, bool unlocked) =>
      SafeArea(
        top: false,
        child: Container(
          color: Colors.white,
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
          child: FilledButton(
            style: FilledButton.styleFrom(
              minimumSize: const Size.fromHeight(AppDimens.confirmButtonHeight),
              backgroundColor:
                  unlocked ? AppColors.brandTeal : const Color(0xFFF28A3B),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(28),
              ),
            ),
            onPressed: () =>
                unlocked ? _openReport(context) : _unlock(context, ref),
            child: Text(
              unlocked ? '查看已解锁的完整解读' : '¥9.9 解锁完整解读',
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
            ),
          ),
        ),
      );

  Future<void> _unlock(BuildContext context, WidgetRef ref) async {
    final order = await ref
        .read(contentOrderApiProvider)
        .create(bizType: ContentOrderBiz.assessment, refId: questionnaireId);
    if (!context.mounted) return;
    if (order == null) {
      AppToast.show(context, '下单失败，请稍后重试');
      return;
    }
    await context.push(
      Uri(
        path: RoutePaths.payment,
        queryParameters: PaymentPageArgs.fromContentOrder(
          orderId: order.orderId,
          bizType: order.bizType.value,
          refId: order.refId,
          title: order.title,
          subtitle: order.subtitle,
          priceFen: order.priceFen,
          payDeadline: order.payDeadline,
        ).toQuery(),
      ).toString(),
    );
    if (context.mounted) {
      ref.invalidate(contentOrderListProvider(ContentOrderBiz.assessment));
    }
  }

  void _openReport(BuildContext context) => context.push(
        Uri(
          path: RoutePaths.assessmentReport,
          queryParameters: {
            'assessmentId': '${userAssessId ?? questionnaireId}',
            'questionnaireId': '$questionnaireId',
            'title': title,
          },
        ).toString(),
      );
}

class _Finding extends StatelessWidget {
  const _Finding({required this.icon, required this.title, required this.text});
  final IconData icon;
  final String title;
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(
                color: Color(0xFFE8F3EF),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 18, color: AppColors.brandTeal),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 3),
                  Text(
                    text,
                    style: const TextStyle(
                      height: 1.5,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
}

class _Benefit extends StatelessWidget {
  const _Benefit({required this.text});
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 9),
        child: Row(
          children: [
            const Icon(
              Icons.check_circle_rounded,
              size: 18,
              color: Color(0xFFF28A3B),
            ),
            const SizedBox(width: 8),
            Expanded(child: Text(text)),
          ],
        ),
      );
}
