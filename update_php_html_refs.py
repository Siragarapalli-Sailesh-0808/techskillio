#!/usr/bin/env python3
"""
Script to replace all .php.html references with .html in HTML and JS files
"""
import os
import re
from pathlib import Path

def update_references(directory):
    """Update all .php.html references to .html in HTML and JS files"""
    
    # File extensions to process
    extensions = ['.html', '.js']
    
    # Statistics
    files_processed = 0
    files_modified = 0
    total_replacements = 0
    
    # Get all files with specified extensions
    for ext in extensions:
        for filepath in Path(directory).glob(f'*{ext}'):
            files_processed += 1
            
            try:
                # Read file content
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Count occurrences before replacement
                occurrences = content.count('.php.html')
                
                if occurrences > 0:
                    # Replace .php.html with .html
                    new_content = content.replace('.php.html', '.html')
                    
                    # Write back to file
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    files_modified += 1
                    total_replacements += occurrences
                    print(f"✓ {filepath.name}: {occurrences} replacements")
                
            except Exception as e:
                print(f"✗ Error processing {filepath.name}: {e}")
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Files processed: {files_processed}")
    print(f"  Files modified: {files_modified}")
    print(f"  Total replacements: {total_replacements}")
    print(f"{'='*60}")

if __name__ == '__main__':
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("Updating .php.html references to .html...")
    print(f"Directory: {script_dir}\n")
    
    update_references(script_dir)
    
    print("\n✓ Update complete!")
