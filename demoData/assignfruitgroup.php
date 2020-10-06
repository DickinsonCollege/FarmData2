


// Load plantings.
$planting_ids = array(1, 2, 3,4);
$assets = array();
foreach ($planting_ids as $id) {
  $assets[] = farm_asset_load($id);
}

// Load group.
$group_id = 13;
$group = farm_asset_load($group_id);
$groups = array($group);

// Create a group membership log that puts the assets in the group.
farm_group_membership_set($assets, $groups);