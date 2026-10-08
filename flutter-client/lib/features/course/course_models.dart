/// 音视频课程数据模型。
///
/// 课程由后台（管理端）上传维护，客户端只读展示；
/// 免费课程直接可看，付费课程购买后解锁全部课时，
/// 未购买时仅开放标记了 freePreview 的试看课时。
library;

/// 课时媒体类型。
enum CourseMediaType {
  video,
  audio;

  static CourseMediaType parse(String? raw) =>
      raw == 'audio' ? CourseMediaType.audio : CourseMediaType.video;
}

/// 课程课时（一节音频或视频）。
class CourseLesson {
  const CourseLesson({
    required this.id,
    required this.title,
    required this.mediaType,
    required this.mediaUrl,
    required this.durationSeconds,
    required this.freePreview,
  });

  final int id;
  final String title;
  final CourseMediaType mediaType;

  /// 媒体地址。mock 模式下为 `asset:` 前缀的本地资源路径。
  final String mediaUrl;

  /// 时长（秒）。
  final int durationSeconds;

  /// 是否免费试看（免费课程全部课时视为可看，由 Course 层判断）。
  final bool freePreview;

  bool get isAsset => mediaUrl.startsWith('asset:');

  String get assetPath =>
      isAsset ? mediaUrl.substring('asset:'.length) : mediaUrl;

  String get durationLabel {
    final m = durationSeconds ~/ 60;
    final s = durationSeconds % 60;
    return s == 0 ? '$m 分钟' : '$m 分 ${s.toString().padLeft(2, '0')} 秒';
  }

  factory CourseLesson.fromJson(Map<String, dynamic> json) => CourseLesson(
        id: (json['id'] as num?)?.toInt() ?? 0,
        title: json['title']?.toString() ?? '',
        mediaType: CourseMediaType.parse(json['mediaType']?.toString()),
        mediaUrl: json['mediaUrl']?.toString() ?? '',
        durationSeconds: (json['durationSeconds'] as num?)?.toInt() ?? 0,
        freePreview: json['freePreview'] == true,
      );
}

/// 课程卡片/详情。
class Course {
  const Course({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.category,
    required this.priceFen,
    required this.lessonCount,
    required this.totalMinutes,
    required this.learnedCount,
    required this.purchased,
    this.coverEmoji,
    this.description,
    this.teacherName,
    this.teacherTitle,
    this.lessons = const [],
  });

  final int id;
  final String title;
  final String subtitle;

  /// 分类：家庭教育 / 亲密关系 / 情绪管理 / 自我成长 等。
  final String category;

  /// 价格（分）。0 表示免费课程。
  final int priceFen;

  final int lessonCount;

  /// 总时长（分钟）。
  final int totalMinutes;

  /// 学习人数。
  final int learnedCount;

  /// 当前用户是否已购买（免费课程恒为 true，由 getter 兜底）。
  final bool purchased;

  /// 封面占位 emoji（后台未传封面图时的展示兜底）。
  final String? coverEmoji;

  /// 课程简介（详情页）。
  final String? description;

  final String? teacherName;
  final String? teacherTitle;

  /// 课时列表（仅详情接口返回）。
  final List<CourseLesson> lessons;

  bool get isFree => priceFen <= 0;

  /// 是否解锁全部课时（免费或已购）。
  bool get isUnlocked => isFree || purchased;

  String get priceLabel => isFree ? '免费' : '¥${(priceFen / 100).toStringAsFixed(priceFen % 100 == 0 ? 0 : 2)}';

  /// 判断某课时是否可播放。
  bool canPlay(CourseLesson lesson) => isUnlocked || lesson.freePreview;

  factory Course.fromJson(Map<String, dynamic> json) => Course(
        id: (json['id'] as num?)?.toInt() ?? 0,
        title: json['title']?.toString() ?? '',
        subtitle: json['subtitle']?.toString() ?? '',
        category: json['category']?.toString() ?? '其他',
        priceFen: (json['priceFen'] as num?)?.toInt() ?? 0,
        lessonCount: (json['lessonCount'] as num?)?.toInt() ?? 0,
        totalMinutes: (json['totalMinutes'] as num?)?.toInt() ?? 0,
        learnedCount: (json['learnedCount'] as num?)?.toInt() ?? 0,
        purchased: json['purchased'] == true,
        coverEmoji: json['coverEmoji']?.toString(),
        description: json['description']?.toString(),
        teacherName: json['teacherName']?.toString(),
        teacherTitle: json['teacherTitle']?.toString(),
        lessons: [
          for (final item in (json['lessons'] as List?) ?? const [])
            CourseLesson.fromJson(Map<String, dynamic>.from(item as Map)),
        ],
      );
}
