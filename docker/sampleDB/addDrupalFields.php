<?php

// Functions Defined and used in this file:
//
// add_field_instance($name, $etype, $label, $bundle, $widget=null)
// copy_field($fname, $newname)
// create_field($name, $type, $label, $widget, $cardinality)

// *** Crop/Variety Vocabulary Fields ***
// Add fields to the field_crops bundle to hold the default units
// and information about each possible converion.

// Add a field for the default units of the crop.
add_field_instance('field_farm_quantity_units','taxonomy_term','Default Units','farm_crops');

// Add a field for quantity that will hold all of the conversions.
add_field_instance('field_farm_quantity','taxonomy_term','Conversions','farm_crops', 'field_collection_embed');

function copy_field($fname, $newname) {
    // If the new field exists, delete it.
    if (field_info_field($newname)) {
        field_delete_field($newname);
    }

    $field = field_info_field($fname);
    $field['field_name'] = $newname;
    field_create_field($field);
}

function add_field_instance($name, $etype, $label, $bundle, $widget=null) {
    // If the field instance exists in the bundle, delete it.
    // This is for testing/debugging so the script can be run over and over.
    $instance = field_info_instance($etype, $name, $bundle);
    if ($instance) {
        field_delete_instance($instance);
    }

    $field = field_info_field($name);
    $field['label'] = $label;
    $field['bundle'] = $bundle;
    $field['entity_type'] = $etype;

    if ($widget) {
        $field['widget'] = array(
            'type' => $widget,
        );
    }

    field_create_instance($field);
}

function create_field($name, $type, $label, $widget, $cardinality) {
    // If the field exists, delete it.
    if (field_info_field($name)) {
        field_delete_field($name);
    }

    $instance = array(
        'field_name' => $name, 
        'type' => $type, 
        'label' => $label,
        'cardinality' => $cardinality,
        'widget' => array(
            'type' => $widget,
        ),
        'settings' => array(),
        'required' => FALSE,
    );
    field_create_field($instance); 
}
?>