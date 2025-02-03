<?php
/**
 * Plugin Name: WP-CLI DMG Read More Search
 * Description: Custom WP-CLI command to find posts with the Gutenberg Read More block.
 * Version: 1.0
 * Author: Your Name
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
    return;
}

class DMG_Read_More_Search_Command {

    /**
     * Searches for posts containing the Gutenberg Read More block.
     *
     * ## OPTIONS
     *
     * [--date-before=<date>]
     * : Upper bound for post date (YYYY-MM-DD). Defaults to today.
     *
     * [--date-after=<date>]
     * : Lower bound for post date (YYYY-MM-DD). Defaults to 30 days ago.
     *
     * ## EXAMPLES
     *
     *     wp dmg-read-more search
     *     wp dmg-read-more search --date-before=2025-01-01 --date-after=2024-12-01
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function search( $args, $assoc_args ) {
        global $wpdb;

        // Get date range
        $date_before = isset($assoc_args['date-before']) ? $assoc_args['date-before'] : current_time('Y-m-d');
        $date_after  = isset($assoc_args['date-after']) ? $assoc_args['date-after'] : date('Y-m-d', strtotime('-30 days'));

        // Validate date format
        if ( ! preg_match('/\d{4}-\d{2}-\d{2}/', $date_before) || ! preg_match('/\d{4}-\d{2}-\d{2}/', $date_after) ) {
            WP_CLI::error( 'Invalid date format. Use YYYY-MM-DD.' );
            return;
        }

        // Query for posts within date range that contain the Read More block
        $query = $wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts} 
             WHERE post_type = 'post' 
             AND post_status = 'publish' 
             AND post_date_gmt BETWEEN %s AND %s 
             AND post_content LIKE %s
             ORDER BY post_date_gmt DESC",
            "$date_after 00:00:00",
            "$date_before 23:59:59",
            '%<!-- wp:custom/read-more-link %>%'
        );

        $post_ids = $wpdb->get_col($query);

        if ( empty( $post_ids ) ) {
            WP_CLI::log( 'No posts found containing the Read More block.' );
        } else {
            WP_CLI::log( 'Matching Post IDs:' );
            foreach ( $post_ids as $post_id ) {
                WP_CLI::log( $post_id );
            }
        }
    }
}

// Register the command
WP_CLI::add_command( 'dmg-read-more', 'DMG_Read_More_Search_Command' );
