import 'package:flutter/material.dart';

import '../../../core/theme/app_assets.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_dimens.dart';
import '../../../core/theme/app_text_styles.dart';

/// 新客首次进入首页时直接告知权益到账。
///
/// 返回 true 表示进入活动页；false/null 表示先留在首页。
Future<bool?> showNewcomerWelcomeDialog(BuildContext context) {
  return showGeneralDialog<bool>(
    context: context,
    barrierDismissible: true,
    barrierLabel: '关闭新客券提醒',
    barrierColor: Colors.black.withValues(alpha: .48),
    transitionDuration: const Duration(milliseconds: 220),
    pageBuilder: (_, __, ___) => const _NewcomerCouponDialog(),
    transitionBuilder: (_, animation, __, child) {
      final curved = CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
        reverseCurve: Curves.easeInCubic,
      );
      return FadeTransition(
        opacity: curved,
        child: ScaleTransition(
          scale: Tween<double>(begin: .94, end: 1).animate(curved),
          child: child,
        ),
      );
    },
  );
}

class _NewcomerCouponDialog extends StatelessWidget {
  const _NewcomerCouponDialog();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Material(
              color: Colors.transparent,
              child: Container(
                clipBehavior: Clip.antiAlias,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: .18),
                      blurRadius: 36,
                      offset: const Offset(0, 14),
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 22, 20, 17),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset(
                            AppAssets.homeMascot,
                            width: 68,
                            height: 68,
                            fit: BoxFit.contain,
                          ),
                          const SizedBox(height: 6),
                          const _Eyebrow(text: '新客专享 · 自动到账'),
                          const SizedBox(height: 9),
                          const Text(
                            '2张新客券已到账',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: AppColors.textPrimary,
                              fontSize: 24,
                              height: 1.18,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            '不用领、不用做任务，下单时自动抵扣',
                            textAlign: TextAlign.center,
                            style: AppTextStyles.bodyLarge,
                          ),
                          const SizedBox(height: 17),
                          const _CouponRow(
                            icon: Icons.auto_awesome_rounded,
                            title: '9.9元主题解读',
                            meta: '任选主题并预约咨询师 · 7天有效',
                            value: '免费×1',
                          ),
                          const SizedBox(height: 10),
                          const _CouponRow(
                            icon: Icons.support_agent_rounded,
                            title: '首次真人咨询',
                            meta: '99 / 199 / 299元服务可用',
                            value: '减¥20',
                          ),
                          const SizedBox(height: 17),
                          _PrimaryAction(
                            label: '立即去使用',
                            onTap: () => Navigator.of(context).pop(true),
                          ),
                          const SizedBox(height: 2),
                          TextButton(
                            onPressed: () => Navigator.of(context).pop(false),
                            child: const Text('先收下，逛逛首页'),
                          ),
                        ],
                      ),
                    ),
                    Positioned(
                      top: 4,
                      right: 4,
                      child: IconButton(
                        tooltip: '关闭新客券提醒',
                        onPressed: () => Navigator.of(context).pop(false),
                        icon: const Icon(Icons.close_rounded),
                        color: AppColors.textTertiary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _CouponRow extends StatelessWidget {
  const _CouponRow({
    required this.icon,
    required this.title,
    required this.meta,
    required this.value,
  });

  final IconData icon;
  final String title;
  final String meta;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.brandTealLight.withValues(alpha: .82),
            AppColors.purpleTagBg.withValues(alpha: .86),
          ],
        ),
        borderRadius: BorderRadius.circular(AppDimens.radiusInner),
        border: Border.all(color: AppColors.brandTeal.withValues(alpha: .10)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: .9),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: AppColors.brandTeal, size: 21),
          ),
          const SizedBox(width: 11),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTextStyles.bodyLargeStrong),
                const SizedBox(height: 3),
                Text(meta, style: AppTextStyles.label),
              ],
            ),
          ),
          const SizedBox(width: 6),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.brandTeal,
              fontSize: 17,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

/// 首页插帧广告位：弹窗关闭后仍可随时回到活动页。
class NewcomerCampaignBanner extends StatelessWidget {
  const NewcomerCampaignBanner({super.key, required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: '新客见面礼，两张券已到账，去使用',
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(AppDimens.cardRadius),
          child: Ink(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [Color(0xFF078F8C), Color(0xFF5966D9)],
              ),
              borderRadius: BorderRadius.circular(AppDimens.cardRadius),
              boxShadow: [
                BoxShadow(
                  color: AppColors.brandTeal.withValues(alpha: .18),
                  blurRadius: 14,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(14, 13, 12, 13),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: .94),
                      shape: BoxShape.circle,
                    ),
                    child: Image.asset(AppAssets.homeMascot),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '新客见面礼 · 已到账',
                          style: TextStyle(
                            color: Color(0xEBFFFFFF),
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          '免费解读×1  +  真人咨询减¥20',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 15,
                            height: 1.24,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(height: 3),
                        Text(
                          '免费解读需预约咨询师，体验好再送好友',
                          style: TextStyle(
                            color: Color(0xDFFFFFFF),
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: const Icon(
                      Icons.arrow_forward_rounded,
                      size: 18,
                      color: AppColors.brandTeal,
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

class _Eyebrow extends StatelessWidget {
  const _Eyebrow({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.brandTealLight,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: AppColors.brandTeal,
          fontSize: 11,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _PrimaryAction extends StatelessWidget {
  const _PrimaryAction({required this.label, required this.onTap});

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: FilledButton(onPressed: onTap, child: Text(label)),
    );
  }
}
