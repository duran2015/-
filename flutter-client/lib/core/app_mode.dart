import 'package:flutter/foundation.dart';

import 'network/api_env.dart';

/// 运行形态开关：App / 微信小程序（同一份代码切模式）。
///
/// - 编译期：`--dart-define=APP_MODE=mp` 构建小程序版（走 uni-app/小程序
///   宿主时的差异点都按此开关收敛）；
/// - 演示期：mock 构建（API_ENV=mock）下可在「我的 → 账号与安全」里
///   运行时切换预览，重启后恢复编译期默认值。
///
/// 小程序版差异点（当前已收敛）：
/// 1. 登录：携程授权模式（协议勾选 + 授权手机号登录 + getPhoneNumber
///    半屏弹层 + 验证码登录兜底），不出现「我是咨询师」入口；
/// 2. 支付：仅微信支付（小程序不支持支付宝）；
/// 3. 我的：不展示「切换身份」（小程序只做用户端）；
/// 4. 真人咨询会话 / 线上会议（网易云信 NERTC）入口：引导去 App。
class AppMode {
  AppMode._();

  /// 编译期形态值（--dart-define=APP_MODE=app|mp，默认 app）。
  static const String current =
      String.fromEnvironment('APP_MODE', defaultValue: 'app');

  /// 运行时形态。mock 演示允许切换；正式构建恒为编译期值。
  static bool _runtimeMp = current == 'mp';

  /// 形态变化通知（mock 运行时切换时，已打开的页面据此重建，
  /// 例如从「账号与安全」返回「我的」页）。
  static final ValueNotifier<bool> listenable =
      ValueNotifier<bool>(_runtimeMp);

  /// 是否小程序形态。
  static bool get isMiniProgram => _runtimeMp;

  /// 运行时切换（仅 mock 演示构建生效）。
  static void setMiniProgram(bool value) {
    if (!ApiEnv.isMock) return;
    _runtimeMp = value;
    listenable.value = value;
  }

  /// 是否允许运行时切换（仅 mock 演示构建暴露入口）。
  static bool get canToggleRuntime => ApiEnv.isMock;
}
