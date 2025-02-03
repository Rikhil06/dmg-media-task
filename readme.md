# This is the development task for DMG Media

## To active the Read more block plugin you can follow the below steps:

1. Login to the backend
2. Go to the admin area and go to plugins in the left hand side column
3. Active the plugin called 'Read More Block'
4. Go to posts in the left hand side column and create a new post
5. Add a new Gutenberg block and select the 'Read More Link' block.
6. In the right hand side bar you will see a Post search section and here you can search for a post.
7. You can now save the post and on the frontend the following will be shown 'Read More: the post you selected...'

## To active the WP-CLI DMG Read More Search plugin you can follow the below steps:

1. Login to the backend
2. Go to the admin area and go to plugins in the left hand side column
3. Active the plugin called 'WP-CLI DMG Read More Search'
4. You can now go into command line and make sure you have WP-CLI installed which you can find here: [WP-CLI Installation](https://make.wordpress.org/cli/handbook/guides/installing/)
5. From here you can run the below commands:
   `wp dmg-read-more search`
   `wp dmg-read-more search --date-before=2025-01-01 --date-after=2024-12-01`

The date before flag defaults to today's date.
The date after flag defaults to 30 days ago.
