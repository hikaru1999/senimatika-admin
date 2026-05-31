export const GROUND_TYPES = {
  GROUND: "GROUND",
  PATH: "PATH",
};

export const OBJECT_TYPES = {
  NONE: "NONE",
  BANNER: "BANNER",
  BARREL: "BARREL",
  BUSHES: "BUSHES",
  CAMPFIRE: "CAMPFIRE",
  CART: "CART",
  CASTLE: "CASTLE",
  CHEST: "CHEST",
  FLAG: "FLAG",
  FENCE: "FENCE",
  HOUSE: "HOUSE",
  ROCK: "ROCK",
  STATION: "STATION",
  STUMP: "STUMP",
  TENT: "TENT",
  MARKET: "MARKET",
  TREE: "TREE",
  WATCHTOWER: "WATCHTOWER",
  WELL: "WELL",
  WINDMILL: "WINDMILL",
  BOSS: "BOSS",
  ARTIFACT: "ARTIFACT",
};

export const GROUND_VARIANTS = {
  GROUND: ["tile_ground_1", "tile_ground_2"],
  PATH: Array.from({ length: 15 }, (_, i) => `tile_path_${i + 1}`),
};

export const OBJECT_VARIANTS = {
  BANNER: ["obj_blue_banner", "obj_red_banner"],
  BARREL: ["obj_barrel"],
  BUSHES: ["obj_bushes_large", "obj_bushes_medium", "obj_bushes_small"],
  CAMPFIRE: ["obj_campfire"],
  CART: ["obj_cart"],
  CASTLE: ["obj_castle_round", "obj_castle_square"],
  CHEST: ["obj_chest"],
  FLAG: ["obj_flag"],
  FENCE: ["obj_fence_horizontal", "obj_fence_vertical"],
  HOUSE: ["obj_house"],
  ROCK: ["obj_rock_large", "obj_rock_medium", "obj_rock_small"],
  STATION: ["obj_station"],
  STUMP: ["obj_stump_short", "obj_stump_tall"],
  MARKET: ["obj_market"],
  TENT: ["obj_tent"],
  TREE: ["obj_tree_large", "obj_tree_medium", "obj_tree_small"],
  WATCHTOWER: ["obj_watchtower_short", "obj_watchtower_tall"],
  WELL: ["obj_well"],
  WINDMILL: ["obj_windmill"],
  BOSS: ["obj_boss_1", "obj_boss_2", "obj_boss_3", "obj_boss_4"],
  ARTIFACT: ["obj_landmark_gadang", "obj_landmark_tugu", "obj_landmark_aceh", "obj_landmark_bandung", "obj_landmark_sumbar", "obj_landmark_jatim"],
};