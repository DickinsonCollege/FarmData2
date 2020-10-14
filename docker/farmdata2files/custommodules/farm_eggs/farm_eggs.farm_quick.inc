<?php
/**
 * @file
 * Farm eggs quick forms.
 */

/**
 * Implements hook_farm_quick_forms().
 */
function farm_eggs_farm_quick_forms() {
  return array(
    'eggs' => array(
      'label' => t('Eggs'),
      'permission' => 'create farm_harvest log entities',
      'form' => 'farm_eggs_form',
      'file' => 'farm_eggs.farm_quick.inc',
    ),
  );
}

/**
 * Form for adding egg harvest logs.
 */
function farm_eggs_form($form, &$form_state) {

  // Wrapper fieldset.
  $form['eggs'] = array(
    '#type' => 'fieldset',
    '#title' => t('Record an egg harvest'),
    '#description' => t('Use this form to record an egg harvest. A harvest log will be created with standard details filled in.'),
  );

  // Quantity.
  $form['eggs']['quantity'] = array(
    '#type' => 'textfield',
    '#title' => t('Quantity'),
    '#required' => TRUE,
    '#element_validate' => array('element_validate_integer_positive'),
  );

  // Load active assets with the "farm_eggs" asset property.
  $asset_options = array();
  $result = db_query("SELECT a.id FROM {farm_asset_property} p LEFT JOIN {farm_asset} a ON p.id = a.id WHERE p.name = 'farm_eggs' AND a.archived = 0");
  foreach ($result as $row) {
    if (!empty($row->id)) {

      // Load the asset.
      $asset = farm_asset_load($row->id);

      // If the asset didn't load, skip it.
      if (empty($asset)) {
        continue;
      }

      // Add an option (linked to asset).
      $entity_label = entity_label('farm_asset', $asset);
      $entity_uri = entity_uri('farm_asset', $asset);
      $asset_options[$asset->id] = l($entity_label, $entity_uri['path']);
    }
  }

  // If there are asset options, add checkboxes.
  if (!empty($asset_options)) {
    $form['eggs']['assets'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Group/animal'),
      '#description' => t('Select the group/animal that these eggs came from. To add groups/animals to this list, edit their record and check the "Produces eggs" checkbox.'),
      '#options' => $asset_options,
    );
  }

  // Otherwise, show some text about adding groups/animals.
  else {
    $form['eggs']['assets'] = array(
      '#type' => 'markup',
      '#markup' => t('If you would like to associate this egg harvest log with a group/animal asset, edit their record and check the "Produces eggs" checkbox. Then you will be able to select them here.'),
      '#prefix' => '<p>',
      '#suffix' => '</p>',
    );
  }

  // Submit button.
  $form['eggs']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save log'),
  );

  // Return the form.
  return $form;
}

/**
 * Submit function for eggs quick form.
 */
function farm_eggs_form_submit($form, &$form_state) {

  // The log type will be a harvest.
  $log_type = 'farm_harvest';

  // Set log name.
  $log_name = t('Collected @qty egg(s)', array('@qty' => $form_state['values']['quantity']));

  // Load any assets that were selected.
  $assets = array();
  if (!empty($form_state['values']['assets'])) {
    foreach ($form_state['values']['assets'] as $asset_id) {

      // Load the asset.
      $asset = farm_asset_load($asset_id);

      // If it loaded, add it to the array.
      if (!empty($asset)) {
        $assets[] = $asset;
      }
    }
  }

  // Assemble an array of measurements.
  $measurements = array(
    array(
      'measure' => 'count',
      'value' => $form_state['values']['quantity'],
      'units' => t('egg(s)'),
      'label' => '',
    ),
  );

  // Create a new farm quantity log.
  $log = farm_quantity_log_create($log_type, $log_name, REQUEST_TIME, TRUE, $assets, $measurements);

  // Link the log to the quick form.
  farm_quick_entity_link('farm_eggs_form', 'log', $log);
}
