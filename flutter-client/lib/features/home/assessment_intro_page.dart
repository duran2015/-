import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_paths.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimens.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/app_background.dart';
import '../../core/widgets/app_nav_bar.dart';
import '../../utils/load_image.dart';
import 'home_models.dart';

/// 测评过渡介绍页（路由 /assessment/intro）：点「去测试」后的前置页。
///
/// 回答三个问题再让用户开始答题：
/// - 这个测评是什么（简介）
/// - 它能告诉你什么（测什么）
/// - 测完你能获得什么（认知提升）
///
/// 底部 CTA「开始测试」：
/// - mock 预览模式：进原生答题页逐题作答，答完进结果预览页；
/// - 真实环境：打开答题 H5（webview），返回后进入结果预览页。
class AssessmentIntroPage extends ConsumerWidget {
  const AssessmentIntroPage({
    super.key,
    required this.questionnaireId,
    this.questionnaireKey = '',
    required this.title,
    this.subtitle = '',
    this.priceText = '',
    this.originalPriceText,
    this.questionCountText = '',
    this.h5Link = '',
    this.userAssessId,
    this.tested = false,
  });

  final int questionnaireId;
  final String questionnaireKey;
  final String title;
  final String subtitle;
  final String priceText;
  final String? originalPriceText;
  final String questionCountText;
  final String h5Link;
  final int? userAssessId;
  final bool tested;

  static const bool _isMock =
      String.fromEnvironment('API_ENV', defaultValue: '') == 'mock';

  /// 「这个测评能告诉你什么」按问卷类型定制。
  List<String> get _whatItTells => switch (questionnaireKey) {
    'sds' => const ['你近一周的抑郁情绪处于什么水平', '情绪低落、兴趣减退等表现的程度', '当前状态是否需要进一步关注与调节'],
    'sas' => const ['你近一周的焦虑情绪处于什么水平', '紧张、担忧、躯体化反应的程度', '当前状态是否需要进一步关注与调节'],
    'gad7' => const ['你是否存在广泛性焦虑的倾向', '焦虑症状的严重程度分级', '是否建议寻求专业心理支持'],
    'mbti' => const ['你的性格类型与核心特质', '你在决策、社交中的偏好模式', '与你性格匹配的成长方向'],
    _ => const ['你当前心理状态的整体画像', '关键维度的得分与所处区间', '是否需要进一步的关注与调节'],
  };

  /// 「测完你将获得」认知提升（通用三条）。
  List<String> get _whatYouGain => const [
    '一份可视化的测评结果反馈，直观看到自己的状态',
    '对情绪与行为模式的清晰认知，知道「为什么会这样」',
    '针对性的自我调节建议，知道接下来可以怎么做',
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final localIcon = assessmentLocalListIcon(questionnaireKey);
    return Scaffold(
      body: AppPageBackground(
        child: SafeArea(
          child: Column(
            children: [
              AppNavBar(title: title, transparent: true),
              Expanded(
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.fromLTRB(20, 10, 20, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _heroCard(localIcon),
                      const SizedBox(height: 14),
                      _infoCard(
                        icon: Icons.search_rounded,
                        title: '这个测评能告诉你什么',
                        lines: _whatItTells,
                      ),
                      const SizedBox(height: 14),
                      _infoCard(
                        icon: Icons.lightbulb_outline_rounded,
                        title: '测完你将获得',
                        lines: _whatYouGain,
                      ),
                      const SizedBox(height: 14),
                      _noticeCard(),
                    ],
                  ),
                ),
              ),
              _bottomCta(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _heroCard(String? localIcon) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(AppDimens.cardRadiusLarge),
      ),
      child: Column(
        children: [
          if (localIcon != null)
            LoadImage(localIcon, width: 64, height: 64, fit: BoxFit.contain),
          const SizedBox(height: 12),
          Text(title, style: AppTextStyles.titleLarge),
          if (subtitle.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(
              subtitle,
              style: AppTextStyles.body.copyWith(
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (questionCountText.isNotEmpty)
                _metaChip(Icons.help_outline_rounded, questionCountText),
              const SizedBox(width: 8),
              _metaChip(Icons.schedule_rounded, '约 3-5 分钟'),
              const SizedBox(width: 8),
              _metaChip(Icons.payments_outlined, '免费测评'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _metaChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F3),
        borderRadius: BorderRadius.circular(99),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: AppColors.textSecondary),
          const SizedBox(width: 4),
          Text(
            text,
            style: AppTextStyles.caption.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoCard({
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
          for (var i = 0; i < lines.length; i++) ...[
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 20,
                  height: 20,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppColors.brandTeal.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    '${i + 1}',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.brandTeal,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    lines[i],
                    style: AppTextStyles.body.copyWith(height: 1.5),
                  ),
                ),
              ],
            ),
            if (i < lines.length - 1) const SizedBox(height: 10),
          ],
        ],
      ),
    );
  }

  Widget _noticeCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8F0),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Text(
        '测评结果仅供自我了解参考，不构成医疗诊断；你的作答与结果仅自己可见。',
        style: AppTextStyles.caption.copyWith(
          color: const Color(0xFF8A5B3D),
          height: 1.5,
        ),
      ),
    );
  }

  Widget _bottomCta(BuildContext context) {
    final bottomInset = MediaQuery.of(context).padding.bottom;
    return Container(
      padding: EdgeInsets.fromLTRB(20, 12, 20, 12 + bottomInset),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE2EAE6))),
      ),
      child: GestureDetector(
        onTap: () => _start(context),
        child: Container(
          height: AppDimens.confirmButtonHeight,
          decoration: BoxDecoration(
            gradient: AppColors.brandGradient,
            borderRadius: BorderRadius.circular(AppDimens.confirmButtonRadius),
          ),
          alignment: Alignment.center,
          child: Text(
            tested ? '查看基础解读' : '免费开始测评',
            style: AppTextStyles.titleLarge.copyWith(color: Colors.white),
          ),
        ),
      ),
    );
  }

  /// 开始测试：
  /// - mock 预览模式：进原生答题页（逐题作答），答完进结果预览页；
  /// - 真实环境：打开答题 H5（webview），返回后进入结果预览页。
  Future<void> _start(BuildContext context) async {
    final teaserLocation = Uri(
      path: RoutePaths.assessmentResultTeaser,
      queryParameters: {
        'questionnaireId': '$questionnaireId',
        'title': title,
        if (userAssessId != null) 'userAssessId': '$userAssessId',
        'priceText': priceText,
      },
    ).toString();

    // 已测过：直达结果预览页（免费直接看报告，付费未解锁则引导解锁）
    if (tested) {
      await context.push(teaserLocation);
      return;
    }
    // mock 预览：原生答题页补齐「答题」环节
    if (_isMock || h5Link.trim().isEmpty) {
      await context.push(
        Uri(
          path: RoutePaths.assessmentQuiz,
          queryParameters: {
            'questionnaireId': '$questionnaireId',
            'questionnaireKey': questionnaireKey,
            'title': title,
            'priceText': priceText,
            'questionCount':
                '${int.tryParse(questionCountText.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0}',
            if (userAssessId != null) 'userAssessId': '$userAssessId',
          },
        ).toString(),
      );
      return;
    }
    await context.push(
      '${RoutePaths.webview}?url=${Uri.encodeComponent(h5Link)}'
      '&title=${Uri.encodeComponent(title)}&mode=assessment',
    );
    if (!context.mounted) return;
    // 答题 H5 返回：视为已完成作答，进入结果预览页
    await context.push(teaserLocation);
  }
}
