import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { TextControl, PanelBody, Spinner, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

registerBlockType('custom/read-more-link', {
  title: __('Read More Link', 'text-domain'),
  icon: 'admin-links',
  category: 'common',
  attributes: {
    postId: {
      type: 'number',
      default: null,
    },
    postTitle: {
      type: 'string',
      default: '',
    },
    postUrl: {
      type: 'string',
      default: '',
    },
  },

  edit: (props) => {
    const { attributes, setAttributes } = props;
    const { postId, postTitle, postUrl } = attributes;
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch posts based on search query
    useEffect(() => {
      if (searchQuery === '') return;

      setLoading(true);
      const fetchPosts = async () => {
        try {
          const response = await wp.apiFetch({
            path: `/wp/v2/posts?search=${searchQuery}&page=${currentPage}&per_page=5`,
          });
          setPosts(response);
          setTotalPages(Math.ceil(response.length)); // Pagination math
          console.log(Math.ceil(response.length));
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }, [searchQuery, currentPage]);

    // Fetch recent posts by default
    useEffect(() => {
      if (postId) return;

      const fetchRecentPosts = async () => {
        setLoading(true);
        try {
          const recentPosts = await wp.apiFetch({
            path: '/wp/v2/posts?per_page=5',
          });
          setPosts(recentPosts);
        } catch (error) {
          console.error('Error fetching recent posts:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecentPosts();
    }, [postId]);

    const handleSearchChange = (value) => {
      setSearchQuery(value);
      setCurrentPage(1); // Reset page to 1 when search changes
    };

    const handlePostSelect = (post) => {
      setAttributes({
        postId: post.id,
        postTitle: post.title.rendered,
        postUrl: post.link,
      });
    };

    return (
      <div className="read-more-block">
        <InspectorControls>
          <PanelBody title={__('Post Search', 'text-domain')}>
            <TextControl
              label={__('Search for Post', 'text-domain')}
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={__('Search posts...', 'text-domain')}
            />

            {loading && <Spinner />}

            {!loading && posts.length === 0 && (
              <p>{__('No posts found.', 'text-domain')}</p>
            )}

            {!loading && posts.length > 0 && (
              <ul>
                {posts.map((post) => (
                  <li key={post.id}>
                    <Button isLink onClick={() => handlePostSelect(post)}>
                      {post.title.rendered}
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {currentPage > 1 && (
                <Button isLink onClick={() => setCurrentPage(currentPage - 1)}>
                  {__('Previous', 'text-domain')}
                </Button>
              )}
              {currentPage < totalPages && (
                <Button isLink onClick={() => setCurrentPage(currentPage + 1)}>
                  {__('Next', 'text-domain')}
                </Button>
              )}
            </div>
          </PanelBody>
        </InspectorControls>

        <div className="read-more-preview">
          {postId && (
            <RichText
              tagName="p"
              className="dmg-read-more"
              value={`Read More: ${postTitle}`}
              onChange={(content) => setAttributes({ postTitle: content })}
              allowedFormats={[]}
            />
          )}
        </div>
      </div>
    );
  },

  save: (props) => {
    const { attributes } = props;
    const { postTitle, postUrl } = attributes;

    if (!postTitle || !postUrl) {
      return null;
    }

    return (
      <p className="dmg-read-more">
        <a href={postUrl}>{`Read More: ${postTitle}`}</a>
      </p>
    );
  },
});
