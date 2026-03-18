#!/usr/bin/env python3
"""
Script to update all HTML files to use the shared header.html component.
This script will:
1. Remove existing header sections from each HTML file
2. Add header placeholder div
3. Add script tag to load header
"""

import os
import re
from pathlib import Path

def update_html_file(filepath):
    """Update a single HTML file to use shared header."""
    print(f"Processing: {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern to match the entire header section including:
        # - STICKY HEADER WRAPPER div
        # - JOB APPLICATION POPUP
        # - STICKY SOCIAL ICONS
        # - Associated styles
        # - Associated scripts
        
        # Remove the sticky header wrapper (from opening div to closing div)
        # This pattern matches from the sticky-header div to its closing tag
        header_pattern = r'<!-- STICKY HEADER WRAPPER -->.*?</nav>\s*</div>'
        content = re.sub(header_pattern, '', content, flags=re.DOTALL)
        
        # Remove the popup section
        popup_pattern = r'<!-- JOB APPLICATION POPUP -->.*?</div>\s*</div>'
        content = re.sub(popup_pattern, '', content, flags=re.DOTALL)
        
        # Remove sticky social icons
        social_pattern = r'<div class="sticky-social-icons">.*?</div>'
        content = re.sub(social_pattern, '', content, flags=re.DOTALL)
        
        # Remove the associated styles (everything between the style tags after social icons)
        style_pattern = r'<style>\s*\.hot-job-wrapper\s*\{.*?</style>'
        content = re.sub(style_pattern, '', content, flags=re.DOTALL)
        
        # Remove the associated scripts
        script_patterns = [
            r'<script>\s*// Popup functionality.*?</script>',
            r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\',\s*function\s*\(\)\s*\{.*?const dropdowns.*?}\);\s*</script>',
            r'<script>\s*// Optional: Close menu when an item is clicked.*?</script>',
        ]
        
        for pattern in script_patterns:
            content = re.sub(pattern, '', content, flags=re.DOTALL)
        
        # Remove the schema.org script if present (it's in the header section)
        schema_pattern = r'<script type="application/ld\+json">.*?</script>'
        # Keep this one, it's not part of the header
        
        # Add header placeholder and script loader right after <body> tag
        body_pattern = r'(<body>)'
        replacement = r'\1\n  <!-- HEADER PLACEHOLDER -->\n  <div id="header-placeholder"></div>\n'
        content = re.sub(body_pattern, replacement, content)
        
        # Add the spacer div if it doesn't exist
        if 'height: 120px;' not in content:
            spacer = '\n  <!-- SPACER TO PUSH CONTENT BELOW FIXED HEADER -->\n  <div style="height: 120px;"></div>\n'
            # Insert after header placeholder
            content = content.replace('<div id="header-placeholder"></div>', 
                                     '<div id="header-placeholder"></div>' + spacer)
        
        # Add script loader before closing </body> tag
        if 'load-header.js' not in content:
            body_close_pattern = r'(</body>)'
            script_tag = '\n  <script src="load-header.js"></script>\n'
            content = re.sub(body_close_pattern, script_tag + r'\1', content)
        
        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Updated: {filepath}")
            return True
        else:
            print(f"  - No changes needed: {filepath}")
            return False
            
    except Exception as e:
        print(f"  ✗ Error processing {filepath}: {e}")
        return False

def main():
    """Main function to process all HTML files."""
    # Get all HTML files in the current directory
    html_files = list(Path('.').glob('*.html'))
    
    print(f"Found {len(html_files)} HTML files to process\n")
    
    updated_count = 0
    for html_file in html_files:
        if update_html_file(html_file):
            updated_count += 1
    
    print(f"\n{'='*60}")
    print(f"Processing complete!")
    print(f"Updated: {updated_count} files")
    print(f"Total processed: {len(html_files)} files")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
