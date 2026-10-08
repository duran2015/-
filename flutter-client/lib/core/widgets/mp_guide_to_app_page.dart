import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../theme/app_colors.dart';
import '../theme/app_dimens.dart';
import '../theme/app_text_styles.dart';
import '../widgets/app_background.dart';
import '../widgets/app_nav_bar.dart';
import '../widgets/app_toast.dart';

/// 小程序形态功能引导页：真人咨询沟通 / 线上会议（网易云信 IM +
/// NERTC 音视频）在小程序中不支持，引导用户前往 App 继续。
///
/// 触发点（AppMode.isMiniProgram 时由路由层拦截）：
/// - 与咨询师的 IM 会话（/chat 且 targetUserId 非空，即非机器人）；
/// - 咨询室 / 线上会议（/consult-room）。
class MpGuideToAppPage extends StatelessWidget {
  const MpGuideToAppPage({super.key, this.scene = 'consult'});

  /// consult = 咨询沟通；room = 线上会议。
  final String scene;

  @override
  Widget build(BuildContext context) {
    final isRoom = scene == 'room';
    return Scaffold(
      body: AppPageBackground(
        child: SafeArea(
          child: Column(
            children: [
              const AppNavBar(title: '', transparent: true),
              const Spacer(),
              Container(
                width: 88,
                height: 88,
                decoration: const BoxDecoration(
                  color: Color(0xFFE7F1ED),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: const Text('🦌', style: TextStyle(fontSize: 44)),
              ),
              const SizedBox(height: 22),
              Text(
                isRoom ? '线上会议请在 App 中进行' : '咨询沟通请在 App 中进行',
                style: AppTextStyles.titleXLarge,
              ),
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 42),
                child: Text(
                  '真人咨询的${isRoom ? '音视频会议室' : '会话'}基于网易云信音视频能力，'
                  '小程序暂不支持。请前往可鹿 App 继续，你的预约记录与订单会自动同步。',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSecondary,
                    height: 1.7,
                  ),
                ),
              ),
              const SizedBox(height: 34),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 28),
                child: SizedBox(
                  width: double.infinity,
                  height: AppDimens.confirmButtonHeight,
                  child: FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.brandTeal,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(
                            AppDimens.confirmButtonRadius),
                      ),
                    ),
                    onPressed: () =>
                        AppToast.show(context, '演示环境：此处调起应用商店 / App Scheme'),
                    child: const Text('打开 / 下载可鹿 App',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600)),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => context.pop(),
                child: Text('返回',
                    style: AppTextStyles.body
                        .copyWith(color: AppColors.textSecondary)),
              ),
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}
