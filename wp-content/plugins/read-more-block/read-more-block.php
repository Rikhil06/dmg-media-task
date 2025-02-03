<?php
/*
Plugin Name: Read More Block
Description: A custom block to insert a read more link to a post.
Version: 1.0
Author: Your Name
*/

// Enqueue block assets
function read_more_block_assets() {
    wp_enqueue_script(
        'read-more-block-js',
        plugin_dir_url(__FILE__) . 'build/index.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-api-fetch'),
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
    );
}

add_action('enqueue_block_editor_assets', 'read_more_block_assets');
