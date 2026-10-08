import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/im/im_models.dart';
import '../../../core/router/route_paths.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../utils/load_image.dart';
import '../../../utils/ly_cache.dart';
import 'chat_card_logic.dart';
import 'chat_card_style.dart';

/// AI 主动推荐卡（businessID = ai_recommend）方向性卡片（靠机器人一侧）。
///
/// 五种皮肤（card.type）：
/// - 1 咨询师：头像 + 姓名/职称 + 描述 + 价格元信息 → 咨询师主页
/// - 2 课程：封面块 + 标题/副标题 + 讲数/价格 → 课程详情
/// - 3 练习：图标 + 名称 + 收益描述 + 时长 → 心理练习页
/// - 4 测评：图标 + 名称 + 题数/价格 → 测评介绍页
/// - 5 档案：图标 + 引导文案 → 支持档案完善页（对话中主动触发的
///   资料收集入口，方案 B）
///
/// 点击状态：未点全彩 + 主按钮；已点整卡降透明度、按钮变「已查看 ✓」。
/// 状态按 biz+refId 持久化（LyCache / Hive），跨会话保留。
class AiRecommendCard extends StatefulWidget {
  const AiRecommendCard({super.key, required this.card});

  final ImCustomCard card;

  /// 卡片类型：1 咨询师 / 2 课程 / 3 练习 / 4 测评。
  static int bizTypeOf(ImCustomCard card) => card.type ?? 0;

  /// 目标 ID（咨询师 ID / 课程 ID / 问卷 ID；练习卡为 0）。
  static int refIdOf(ImCustomCard card) {
    final params = parseCardLinkParams(card.link);
    return int.tryParse(params['refId'] ?? '') ?? 0;
  }

  static String cacheKeyOf(ImCustomCard card) =>
      'ai_rec_clicked_${bizTypeOf(card)}_${refIdOf(card)}';

  @override
  State<AiRecommendCard> createState() => _AiRecommendCardState();
}

class _AiRecommendCardState extends State<AiRecommendCard> {
  bool _clicked = false;

  ImCustomCard get card => widget.card;
  int get _bizType => AiRecommendCard.bizTypeOf(card);

  @override
  void initState() {
    super.initState();
    _clicked = LyCache.getSync<bool>(
          key: AiRecommendCard.cacheKeyOf(card),
        ) ??
        false;
  }

  String get _typeLabel => switch (_bizType) {
        1 => '咨询师',
        2 => '课程',
        3 => '练习',
        4 => '测评',
        5 => '档案',
        _ => '推荐',
      };

  Future<void> _onTap() async {
    if (!_clicked) {
      setState(() => _clicked = true);
      await LyCache.put(
        key: AiRecommendCard.cacheKeyOf(card),
        value: true,
      );
    }
    if (!mounted) return;
    _navigate();
  }

  void _navigate() {
    final params = parseCardLinkParams(card.link);
    final refId = int.tryParse(params['refId'] ?? '') ?? 0;
    switch (_bizType) {
      case 1:
        context.push('${RoutePaths.consultantDetail}?consultantId=$refId');
      case 2:
        context.push('${RoutePaths.courseDetail}?id=$refId');
      case 3:
        context.push(RoutePaths.supportPractice);
      case 4:
        context.push(
          Uri(path: RoutePaths.assessmentIntro, queryParameters: {
            'questionnaireId': '$refId',
            'title': card.title ?? '心理测评',
            if ((params['priceText'] ?? '').isNotEmpty)
              'priceText': params['priceText']!,
          }).toString(),
        );
      case 5:
        context.push(RoutePaths.supportProfile);
      default:
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: _clicked ? 0.55 : 1,
      child: Container(
        width: ChatCardStyle.resolvedDirectionWidth(context),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          gradient: AppColors.chatCardGradient,
          borderRadius: BorderRadius.circular(ChatCardStyle.cardRadius),
          boxShadow: ChatCardStyle.cardShadow(opacity: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 推荐来源行：✨ 小鹿推荐 · 类型
            Row(
              children: [
                const Icon(Icons.auto_awesome_rounded,
                    size: 13, color: AppColors.brandTeal),
                const SizedBox(width: 4),
                Text(
                  '小鹿推荐 · $_typeLabel',
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.brandTeal,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _body(),
            if ((card.label ?? '').isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                card.label!,
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textTertiary,
                ),
              ),
            ],
            const SizedBox(height: 12),
            _actionButton(),
          ],
        ),
      ),
    );
  }

  Widget _body() {
    switch (_bizType) {
      case 1:
        return Row(
          children: [
            ClipOval(
              child: LoadImage(
                card.logoPic ?? '',
                width: 52,
                height: 52,
                fit: BoxFit.cover,
                errorWidget: Container(
                  width: 52,
                  height: 52,
                  color: const Color(0xFFDCEDE7),
                  child: const Icon(Icons.person_outline_rounded,
                      color: Color(0xFF286D64)),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(child: _titleDesc()),
          ],
        );
      case 2:
        return Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF245F58), Color(0xFF3C8177)],
                ),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.play_circle_outline_rounded,
                  color: Colors.white, size: 26),
            ),
            const SizedBox(width: 12),
            Expanded(child: _titleDesc()),
          ],
        );
      case 3:
        return Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFFE7F1ED),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.self_improvement_rounded,
                  color: Color(0xFF286D64), size: 26),
            ),
            const SizedBox(width: 12),
            Expanded(child: _titleDesc()),
          ],
        );
      case 4:
        return Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFFFFF3EA),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.assignment_outlined,
                  color: Color(0xFF8A5B3D), size: 26),
            ),
            const SizedBox(width: 12),
            Expanded(child: _titleDesc()),
          ],
        );
      case 5:
        return Row(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: const Color(0xFFEAF0FB),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.tune_rounded,
                  color: Color(0xFF3D5A80), size: 26),
            ),
            const SizedBox(width: 12),
            Expanded(child: _titleDesc()),
          ],
        );
      default:
        return _titleDesc();
    }
  }

  Widget _titleDesc() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          card.title ?? '',
          style: AppTextStyles.titleSmall,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        if ((card.desc ?? '').isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(
            card.desc!,
            style: AppTextStyles.caption.copyWith(
              color: AppColors.textSecondary,
              height: 1.4,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ],
    );
  }

  Widget _actionButton() {
    final defaultLabel = switch (_bizType) {
      1 => '查看主页',
      2 => '了解课程',
      3 => '开始练习',
      4 => '去测评',
      5 => '去完善资料',
      _ => '去看看',
    };
    return GestureDetector(
      onTap: _onTap,
      child: Container(
        width: double.infinity,
        height: 40,
        decoration: BoxDecoration(
          gradient: _clicked ? null : ChatCardStyle.tealButtonGradient,
          color: _clicked ? AppColors.innerBackground : null,
          borderRadius: BorderRadius.circular(ChatCardStyle.buttonRadius),
        ),
        alignment: Alignment.center,
        child: Text(
          _clicked
              ? '已查看 ✓'
              : ((card.buttonText ?? '').isNotEmpty
                  ? card.buttonText!
                  : defaultLabel),
          style: AppTextStyles.body.copyWith(
            color: _clicked ? AppColors.textTertiary : Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
