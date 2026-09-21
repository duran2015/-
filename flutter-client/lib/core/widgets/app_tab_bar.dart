import 'package:flutter/material.dart';

/// 注释：通用底部 TabBar（全屏幕 ScreenUtil 响应式规范）
/// 时间：2026/8/4
/// 作者：郭翰林
class AppTabBar extends StatelessWidget {
  const AppTabBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    this.unreadCount = 0,
    this.compact = false,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;
  final int unreadCount;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    const homeLayerColor = Color(0xFFF1F5F0);
    final barColor = compact ? Colors.white : homeLayerColor;
    final bar = NavigationBar(
      height: 68,
      backgroundColor: barColor,
      elevation: 0,
      selectedIndex: currentIndex,
      onDestinationSelected: onTap,
      destinations: [
        const NavigationDestination(
          icon: Icon(Icons.home_outlined),
          selectedIcon: Icon(Icons.home_rounded),
          label: '首页',
        ),
        const NavigationDestination(
          icon: Icon(Icons.people_outline_rounded),
          selectedIcon: Icon(Icons.people_alt_rounded),
          label: '真人支持',
        ),
        const NavigationDestination(
          icon: Icon(Icons.assignment_outlined),
          selectedIcon: Icon(Icons.assignment_rounded),
          label: '测评',
        ),
        const NavigationDestination(
          icon: Icon(Icons.auto_stories_outlined),
          selectedIcon: Icon(Icons.auto_stories_rounded),
          label: '课程练习',
        ),
        const NavigationDestination(
          icon: Icon(Icons.person_outline_rounded),
          selectedIcon: Icon(Icons.person_rounded),
          label: '我的',
        ),
      ],
    );

    if (!compact) {
      return ColoredBox(
        color: homeLayerColor,
        child: SafeArea(top: false, child: bar),
      );
    }

    return SafeArea(
      top: false,
      minimum: const EdgeInsets.fromLTRB(26, 0, 26, 12),
      child: Material(
        color: Colors.white,
        elevation: 12,
        shadowColor: const Color(0x330F2E29),
        borderRadius: BorderRadius.circular(34),
        clipBehavior: Clip.antiAlias,
        child: bar,
      ),
    );
  }
}
