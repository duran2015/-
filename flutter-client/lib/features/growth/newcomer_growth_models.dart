/// 新客活动页的可演示状态。
///
/// 真实接入时由营销权益接口返回；原型可通过 `?stage=share|reward` 走查。
enum GrowthCampaignStage { newcomer, shareUnlocked, rewardReceived }

GrowthCampaignStage growthCampaignStageFrom(String? value) => switch (value) {
  'share' => GrowthCampaignStage.shareUnlocked,
  'reward' => GrowthCampaignStage.rewardReceived,
  _ => GrowthCampaignStage.newcomer,
};
