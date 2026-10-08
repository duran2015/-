import '../app_mode.dart';
import 'route_paths.dart';

/// 路由身份守卫。
/// 契约来源：contracts/route_code_contract.md §3.4：
/// 「路由跳转前校验登录态与身份：咨询师专属码（1010）在用户端拦截」。
class RouteGuards {
  RouteGuards._();

  /// 用户身份（LoginData.currentIdentity 取值）
  static const String identityUser = 'user';

  /// 咨询师身份
  static const String identityConsultant = 'consultant';

  /// 无需登录的公共路径前缀（含各自子路径）。
  static const List<String> publicPrefixes = <String>[
    RoutePaths.splash,
    RoutePaths.login, // 含 /login/verify、/login/bind-phone 等子路径
    RoutePaths.webview, // H5 落地页允许未登录访问
    RoutePaths.newcomerGift, // 好友分享落地页先承接权益，再引导登录
  ];

  /// 咨询师专属路径（契约 §3.4：1010 在用户端拦截；
  /// 咨询师工作台同理仅咨询师可进）。
  static const Set<String> consultantOnlyPaths = <String>{
    RoutePaths.consultRecord,
    RoutePaths.counselor,
    RoutePaths.counselorOrderDetail,
  };

  /// 小程序形态：「操作型」路径（需要登录），其余页面游客可浏览。
  /// 浏览（首页/测评/课程/咨询师列表等）不拦截；下单支付、查看订单
  /// 等操作才引导登录（携程式：先看后授权）。
  static const List<String> mpAuthRequiredPrefixes = <String>[
    RoutePaths.payment,
    RoutePaths.paymentSuccess,
    RoutePaths.paymentIntake,
    RoutePaths.orders,
    RoutePaths.orderCenter,
    RoutePaths.orderDetail,
  ];

  /// 该路径是否需要登录态。
  static bool requiresAuth(String path) =>
      !publicPrefixes.any((p) => path == p || path.startsWith('$p/'));

  /// 小程序形态下该路径是否为「操作型」（需登录）。
  static bool mpRequiresAuth(String path) =>
      mpAuthRequiredPrefixes.any((p) => path == p || path.startsWith('$p/'));

  /// 守卫判定：返回重定向目标路径；返回 null 表示放行。
  ///
  /// - App 形态：未登录且访问需鉴权路径 → /login；
  /// - 小程序形态：仅操作型路径校验登录，游客可浏览其余页面；
  /// - 咨询师专属路径且 currentIdentity != consultant → /home（契约 §3.4）。
  static String? guardRedirect({
    required String path,
    required bool loggedIn,
    required String? identity,
  }) {
    if (AppMode.isMiniProgram) {
      if (mpRequiresAuth(path) && !loggedIn) {
        return RoutePaths.login;
      }
    } else if (requiresAuth(path) && !loggedIn) {
      return RoutePaths.login;
    }
    if (consultantOnlyPaths.contains(path) && identity != identityConsultant) {
      return RoutePaths.home;
    }
    return null;
  }
}
