import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_paths.dart';
import '../../core/theme/app_assets.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_dimens.dart';
import '../../core/theme/app_text_styles.dart';
import '../../core/widgets/app_background.dart';
import '../../core/widgets/app_card.dart';
import '../../core/widgets/app_nav_bar.dart';
import 'newcomer_growth_models.dart';

/// 新客福利活动页：只解释用户现在有什么、做完什么、接下来得到什么。
class NewcomerGrowthPage extends StatefulWidget {
  const NewcomerGrowthPage({
    super.key,
    this.initialStage = GrowthCampaignStage.newcomer,
  });

  final GrowthCampaignStage initialStage;

  @override
  State<NewcomerGrowthPage> createState() => _NewcomerGrowthPageState();
}

class _NewcomerGrowthPageState extends State<NewcomerGrowthPage> {
  void _goToInterpretation() =>
      context.go('${RoutePaths.home}?tab=consultant&offer=interpretation');

  void _goToHumanSupport() => context.go('${RoutePaths.home}?tab=consultant');

  void _showRules() {
    showModalBottomSheet<void>(
      context: context,
      useSafeArea: true,
      isScrollControlled: true,
      builder: (_) => const _CampaignRulesSheet(),
    );
  }

  void _showShareSheet() {
    showModalBottomSheet<void>(
      context: context,
      useSafeArea: true,
      builder: (_) => const _GiftShareSheet(),
    );
  }

  VoidCallback get _primaryAction => switch (widget.initialStage) {
        GrowthCampaignStage.newcomer => _goToInterpretation,
        GrowthCampaignStage.shareUnlocked => _showShareSheet,
        GrowthCampaignStage.rewardReceived => _goToInterpretation,
      };

  String get _primaryLabel => switch (widget.initialStage) {
        GrowthCampaignStage.newcomer => '去预约免费解读',
        GrowthCampaignStage.shareUnlocked => '送给好友',
        GrowthCampaignStage.rewardReceived => '去预约新主题',
      };

  String get _primaryEyebrow => switch (widget.initialStage) {
        GrowthCampaignStage.newcomer => '现在要做的事',
        GrowthCampaignStage.shareUnlocked => '分享礼已解锁',
        GrowthCampaignStage.rewardReceived => '新奖励已到账',
      };

  String get _primarySummary => switch (widget.initialStage) {
        GrowthCampaignStage.newcomer => '咨询师主题解读 · 实付¥0',
        GrowthCampaignStage.shareUnlocked => '送好友1次免费解读',
        GrowthCampaignStage.rewardReceived => '再体验1个新主题',
      };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pageBackground,
      appBar: AppNavBar(
        title: '新人福利',
        actions: [
          TextButton(
            onPressed: _showRules,
            child: const Text('活动说明', style: TextStyle(fontSize: 12)),
          ),
        ],
      ),
      body: AppPageBackground(
        child: SafeArea(
          top: false,
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 760),
              child: ListView(
                padding: const EdgeInsets.fromLTRB(15, 16, 15, 28),
                children: [
                  const _CampaignHero(),
                  const SizedBox(height: 20),
                  const _SectionTitle(
                    title: '现在，先完成这一件事',
                    subtitle: '新客免费',
                  ),
                  const SizedBox(height: 11),
                  _ActivationCard(stage: widget.initialStage),
                  const SizedBox(height: 12),
                  const _FlowHint(
                    text: '建议先完成免费解读，再决定要不要分享或继续咨询',
                  ),
                  const SizedBox(height: 22),
                  const _SectionTitle(
                    title: '体验之后，你有两种选择',
                    subtitle: '不需要现在决定',
                  ),
                  const SizedBox(height: 11),
                  _AfterExperienceCard(
                    stage: widget.initialStage,
                    onStart: _goToInterpretation,
                    onShare: _showShareSheet,
                    onSupport: _goToHumanSupport,
                  ),
                  const SizedBox(height: 12),
                  Center(
                    child: TextButton(
                      onPressed: _showRules,
                      child: const Text('查看活动说明'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: SafeArea(
        top: false,
        child: Container(
          color: Colors.white,
          padding: const EdgeInsets.fromLTRB(15, 10, 15, 12),
          child: Center(
            heightFactor: 1,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 730),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(_primaryEyebrow, style: AppTextStyles.label),
                        const SizedBox(height: 2),
                        Text(
                          _primarySummary,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyles.bodyLargeStrong,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: FilledButton(
                      onPressed: _primaryAction,
                      child: Text(_primaryLabel),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CampaignHero extends StatelessWidget {
  const _CampaignHero();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 18, 14, 18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF078F8C), Color(0xFF5966D9)],
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: AppColors.brandTeal.withValues(alpha: .18),
            blurRadius: 18,
            offset: const Offset(0, 7),
          ),
        ],
      ),
      child: Row(
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _WhitePill(text: '新客专享 · 已到账'),
                SizedBox(height: 11),
                Text(
                  '先做一次免费解读，\n再决定下一步。',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    height: 1.2,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  '选择主题和咨询师，预约时间后开始解读',
                  style: TextStyle(color: Color(0xEFFFFFFF), fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Container(
            width: 82,
            height: 82,
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: .94),
              shape: BoxShape.circle,
            ),
            child: Image.asset(AppAssets.homeMascot),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Text(title, style: AppTextStyles.titleLarge),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            subtitle,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AppTextStyles.caption,
          ),
        ),
      ],
    );
  }
}

class _ActivationCard extends StatelessWidget {
  const _ActivationCard({required this.stage});

  final GrowthCampaignStage stage;

  @override
  Widget build(BuildContext context) {
    final completed = stage != GrowthCampaignStage.newcomer;
    return AppCard(
      radius: AppDimens.cardRadiusLarge,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text('咨询师主题解读', style: AppTextStyles.titleLarge),
              ),
              _StatusPill(
                text: completed ? '已完成' : '7天有效',
                active: true,
              ),
            ],
          ),
          const SizedBox(height: 10),
          const Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '¥0',
                style: TextStyle(
                  color: AppColors.brandTeal,
                  fontSize: 32,
                  height: 1,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(width: 8),
              Padding(
                padding: EdgeInsets.only(bottom: 2),
                child: Text(
                  '原价¥9.9',
                  style: TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 12,
                    decoration: TextDecoration.lineThrough,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 9),
          Text(
            completed ? '这次解读已经完成，后续福利已为你打开。' : '不用先购买咨询。任选一个主题，再选择咨询师和可预约时间。',
            style: AppTextStyles.body.copyWith(height: 1.5),
          ),
          const SizedBox(height: 13),
          const Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _BenefitPoint(icon: Icons.topic_outlined, text: '任选1个主题'),
              _BenefitPoint(icon: Icons.person_search_outlined, text: '选择咨询师'),
              _BenefitPoint(icon: Icons.calendar_today_outlined, text: '预约时间'),
            ],
          ),
        ],
      ),
    );
  }
}

class _BenefitPoint extends StatelessWidget {
  const _BenefitPoint({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 7),
      decoration: BoxDecoration(
        color: AppColors.innerBackground,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 15, color: AppColors.brandTeal),
          const SizedBox(width: 5),
          Text(text,
              style:
                  AppTextStyles.label.copyWith(color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}

class _FlowHint extends StatelessWidget {
  const _FlowHint({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(Icons.keyboard_arrow_down_rounded,
            size: 18, color: AppColors.brandTeal),
        const SizedBox(width: 4),
        Flexible(
            child: Text(text,
                textAlign: TextAlign.center, style: AppTextStyles.caption)),
      ],
    );
  }
}

class _AfterExperienceCard extends StatelessWidget {
  const _AfterExperienceCard({
    required this.stage,
    required this.onStart,
    required this.onShare,
    required this.onSupport,
  });

  final GrowthCampaignStage stage;
  final VoidCallback onStart;
  final VoidCallback onShare;
  final VoidCallback onSupport;

  @override
  Widget build(BuildContext context) {
    final unlocked = stage != GrowthCampaignStage.newcomer;
    final rewarded = stage == GrowthCampaignStage.rewardReceived;
    return AppCard(
      radius: AppDimens.cardRadiusLarge,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _ChoiceRow(
            icon: Icons.card_giftcard_rounded,
            title: rewarded ? '你的新主题奖励已到账' : '觉得有帮助，送好友一次',
            description:
                rewarded ? '好友已完成解读，你可以再免费体验1个新主题。' : '好友免费解读；好友完成后，你再得1个新主题。',
            badge: rewarded
                ? '已到账'
                : unlocked
                    ? '可分享'
                    : '完成解读后解锁',
            active: unlocked,
          ),
          if (unlocked) ...[
            const SizedBox(height: 11),
            Align(
              alignment: Alignment.centerLeft,
              child: OutlinedButton.icon(
                onPressed: rewarded ? onStart : onShare,
                icon: Icon(
                  rewarded
                      ? Icons.auto_awesome_rounded
                      : Icons.ios_share_rounded,
                  size: 18,
                ),
                label: Text(
                  rewarded ? '使用新主题免费解读' : '送给好友',
                ),
              ),
            ),
          ],
          const SizedBox(height: 15),
          const Divider(height: 1),
          const SizedBox(height: 15),
          const _ChoiceRow(
            icon: Icons.forum_outlined,
            title: '想继续深入聊',
            description: '首次真人咨询立减¥20，99 / 199 / 299元服务都能用。',
            badge: '¥79起',
            active: true,
          ),
          const SizedBox(height: 10),
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton.icon(
              onPressed: onSupport,
              icon: const Icon(Icons.person_search_outlined, size: 18),
              label: const Text('先看看咨询师'),
            ),
          ),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 9),
            decoration: BoxDecoration(
              color: AppColors.indigo.withValues(alpha: .06),
              borderRadius: BorderRadius.circular(AppDimens.radiusInner),
            ),
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.refresh_rounded, color: AppColors.indigo, size: 18),
                SizedBox(width: 7),
                Expanded(
                  child: Text(
                    '首次真人咨询完成后，再送¥20续聊券，7天内可用。',
                    style: AppTextStyles.caption,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ChoiceRow extends StatelessWidget {
  const _ChoiceRow({
    required this.icon,
    required this.title,
    required this.description,
    required this.badge,
    required this.active,
  });

  final IconData icon;
  final String title;
  final String description;
  final String badge;
  final bool active;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 38,
          height: 38,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color:
                active ? AppColors.brandTealLight : AppColors.innerBackground,
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            size: 20,
            color: active ? AppColors.brandTeal : AppColors.textTertiary,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: AppTextStyles.bodyLargeStrong),
              const SizedBox(height: 4),
              Text(description,
                  style: AppTextStyles.caption.copyWith(height: 1.45)),
            ],
          ),
        ),
        const SizedBox(width: 8),
        _StatusPill(text: badge, active: active),
      ],
    );
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.text, required this.active});

  final String text;
  final bool active;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      decoration: BoxDecoration(
        color: active ? AppColors.brandTealLight : AppColors.innerBackground,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        text,
        style: AppTextStyles.label.copyWith(
          color: active ? AppColors.brandTeal : AppColors.textTertiary,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _WhitePill extends StatelessWidget {
  const _WhitePill({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: .18),
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _GiftShareSheet extends StatelessWidget {
  const _GiftShareSheet();

  void _finish(BuildContext context, String message) {
    Navigator.of(context).pop();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), behavior: SnackBarBehavior.floating),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 22),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('送好友1次免费解读', style: AppTextStyles.titleLarge),
          const SizedBox(height: 6),
          const Text('好友领取后7天内有效，解读结果仅好友本人可见', style: AppTextStyles.caption),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _ShareTarget(
                icon: Icons.chat_bubble_rounded,
                label: '微信好友',
                color: const Color(0xFF24C768),
                onTap: () => _finish(context, '分享卡片已准备'),
              ),
              _ShareTarget(
                icon: Icons.people_alt_rounded,
                label: '朋友圈',
                color: const Color(0xFF24C768),
                onTap: () => _finish(context, '分享卡片已准备'),
              ),
              _ShareTarget(
                icon: Icons.link_rounded,
                label: '复制链接',
                color: AppColors.indigo,
                onTap: () => _finish(context, '邀请链接已复制'),
              ),
            ],
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('取消'),
            ),
          ),
        ],
      ),
    );
  }
}

class _ShareTarget extends StatelessWidget {
  const _ShareTarget({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          children: [
            Container(
              width: 50,
              height: 50,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: color.withValues(alpha: .10),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 7),
            Text(label, style: AppTextStyles.caption),
          ],
        ),
      ),
    );
  }
}

class _CampaignRulesSheet extends StatelessWidget {
  const _CampaignRulesSheet();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 26),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('活动说明', style: AppTextStyles.titleLarge),
          const SizedBox(height: 14),
          Text(
            '1. 新用户自动获得1次免费主题解读和1张首次真人咨询减20元券；主题解读需选择咨询师并预约时间。\n'
            '2. 完成首次主题解读后，可送1位好友免费解读；好友完成后，你再获得1次新主题免费解读。\n'
            '3. 完成首次真人咨询后，24小时内发放1张20元继续咨询券，有效期7天。\n'
            '4. 优惠券结算时自动抵扣，不可折现或转售。',
            style: AppTextStyles.bodyLarge.copyWith(height: 1.72),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('我知道了'),
            ),
          ),
        ],
      ),
    );
  }
}

/// 好友打开分享链接后的承接页。
class NewcomerGiftPage extends StatelessWidget {
  const NewcomerGiftPage({super.key, required this.inviter});

  final String inviter;

  @override
  Widget build(BuildContext context) {
    return _SimpleLandingPage(
      eyebrow: '来自$inviter',
      title: '好友送你的免费解读',
      value: '免费×1',
      description: '登录后任选一个主题，再选择咨询师和时间完成预约。',
      buttonText: '登录并预约解读',
      onTap: () =>
          context.go('${RoutePaths.home}?tab=consultant&offer=interpretation'),
    );
  }
}

/// 首次真人咨询完成后的二次消费承接页。
class NewcomerFollowUpPage extends StatelessWidget {
  const NewcomerFollowUpPage({super.key});

  @override
  Widget build(BuildContext context) {
    return _SimpleLandingPage(
      eyebrow: '服务完成加赠',
      title: '继续咨询券已到账',
      value: '减¥20',
      description: '99 / 199 / 299元真人咨询均可用，7天内下单自动抵扣。',
      buttonText: '看看适合的咨询师',
      onTap: () => context.go('${RoutePaths.home}?tab=consultant'),
    );
  }
}

class _SimpleLandingPage extends StatelessWidget {
  const _SimpleLandingPage({
    required this.eyebrow,
    required this.title,
    required this.value,
    required this.description,
    required this.buttonText,
    required this.onTap,
  });

  final String eyebrow;
  final String title;
  final String value;
  final String description;
  final String buttonText;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppPageBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: AppCard(
                  radius: 28,
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(AppAssets.homeMascot, width: 92, height: 92),
                      const SizedBox(height: 12),
                      Text(eyebrow, style: AppTextStyles.caption),
                      const SizedBox(height: 8),
                      Text(title, style: AppTextStyles.titleXLarge),
                      const SizedBox(height: 14),
                      Text(
                        value,
                        style: const TextStyle(
                          color: AppColors.brandTeal,
                          fontSize: 34,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        description,
                        textAlign: TextAlign.center,
                        style: AppTextStyles.bodyLarge.copyWith(height: 1.55),
                      ),
                      const SizedBox(height: 22),
                      SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: onTap,
                          child: Text(buttonText),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
