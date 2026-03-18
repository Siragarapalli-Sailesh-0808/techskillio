#!/usr/bin/env python3
"""
Script to update all HTML files to use the shared header.html component.
This script will:
1. Remove existing embedded header sections from each HTML file
2. Add header placeholder div
3. Add spacer div
4. Add script tag to load header
"""

import os
import re
from pathlib import Path

def find_header_end(content, start_pos):
    """Find the end of the sticky-header div by counting nested divs."""
    depth = 1
    pos = start_pos
    
    while depth > 0 and pos < len(content):
        # Find next div tag (opening or closing)
        open_match = content.find('<div', pos)
        close_match = content.find('</div>', pos)
        
        if close_match == -1:
            break
            
        if open_match != -1 and open_match < close_match:
            depth += 1
            pos = open_match + 4
        else:
            depth -= 1
            pos = close_match + 6
            if depth == 0:
                return pos
    
    return -1

def remove_embedded_header(content):
    """Remove the embedded header section from HTML content."""
    
    # Find the sticky-header div
    sticky_header_start = content.find('<div class="sticky-header"')
    
    if sticky_header_start == -1:
        return content, False
    
    # Find the end of the sticky-header div
    div_start = content.find('>', sticky_header_start) + 1
    header_end = find_header_end(content, div_start)
    
    if header_end == -1:
        print("  ⚠ Could not find end of sticky-header div")
        return content, False
    
    # Remove the header section
    content = content[:sticky_header_start] + content[header_end:]
    
    # Remove the spacer div if it exists right after
    spacer_pattern = r'\s*<div style="height:\s*120px;"></div>\s*'
    content = re.sub(spacer_pattern, '', content, count=1)
    
    # Remove popup section if it exists
    popup_start = content.find('<!-- JOB APPLICATION POPUP -->')
    if popup_start != -1:
        popup_div_start = content.find('<div id="applyPopup"', popup_start)
        if popup_div_start != -1:
            popup_end = find_header_end(content, content.find('>', popup_div_start) + 1)
            if popup_end != -1:
                content = content[:popup_start] + content[popup_end:]
    
    # Remove sticky social icons if they exist
    social_start = content.find('<div class="sticky-social-icons">')
    if social_start != -1:
        social_end = find_header_end(content, social_start + 34)
        if social_end != -1:
            content = content[:social_start] + content[social_end:]
    
    # Remove associated styles
    style_patterns = [
        r'<style>\s*\.hot-job-wrapper\s*\{.*?</style>',
        r'<style>\s*body\.has-sticky-header.*?</style>',
    ]
    
    for pattern in style_patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # Remove associated scripts
    script_patterns = [
        r'<script>\s*// Popup functionality.*?</script>',
        r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\',\s*function\s*\(\)\s*\{.*?const dropdowns.*?}\);\s*</script>',
        r'<script>\s*// Optional: Close menu when an item is clicked.*?</script>',
        r'<script>\s*function openApplyPopup\(\).*?</script>',
    ]
    
    for pattern in script_patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    return content, True

def add_shared_header_components(content):
    """Add header placeholder, spacer, and script loader."""
    
    # Check if already has header-placeholder
    if 'header-placeholder' in content:
        return content, False
    
    # Add header placeholder and spacer right after <body> tag
    body_match = re.search(r'<body[^>]*>', content)
    if not body_match:
        print("  ⚠ Could not find <body> tag")
        return content, False
    
    body_end = body_match.end()
    
    header_components = '''
  <!-- HEADER PLACEHOLDER -->
  <div id="header-placeholder"></div>

  <!-- SPACER TO PUSH CONTENT BELOW FIXED HEADER -->
  <div style="height: 120px;"></div>
'''
    
    content = content[:body_end] + header_components + content[body_end:]
    
    # Add script loader before closing </body> tag if not already present
    if 'load-header.js' not in content:
        content = content.replace('</body>', '  <script src="load-header.js"></script>\n</body>')
    
    return content, True

def update_html_file(filepath):
    """Update a single HTML file to use shared header."""
    
    # Skip header.html itself
    if filepath.name == 'header.html':
        return False
    
    # Skip index.html as it already uses the shared header
    if filepath.name == 'index.html':
        print(f"  - Skipping {filepath.name} (already uses shared header)")
        return False
    
    print(f"Processing: {filepath.name}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove embedded header
        content, header_removed = remove_embedded_header(content)
        
        # Add shared header components
        content, components_added = add_shared_header_components(content)
        
        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Updated: {filepath.name}")
            return True
        else:
            print(f"  - No changes needed: {filepath.name}")
            return False
            
    except Exception as e:
        print(f"  ✗ Error processing {filepath.name}: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main function to process all HTML files."""
    # Get all HTML files in the current directory
    html_files = sorted(list(Path('.').glob('*.html')))
    
    print(f"Found {len(html_files)} HTML files\n")
    print("="*60)
    
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    for html_file in html_files:
        try:
            if update_html_file(html_file):
                updated_count += 1
            else:
                skipped_count += 1
        except Exception as e:
            error_count += 1
            print(f"  ✗ Error: {e}")
    
    print("\n" + "="*60)
    print(f"Processing complete!")
    print(f"  ✓ Updated: {updated_count} files")
    print(f"  - Skipped: {skipped_count} files")
    print(f"  ✗ Errors: {error_count} files")
    print(f"  Total: {len(html_files)} files")
    print("="*60)

if __name__ == '__main__':
    main()
