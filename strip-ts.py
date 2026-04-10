import os
import re

ui_dir = r"c:\Users\MOHIT PATWAL\Desktop\erpnisha\components\ui"

for filename in os.listdir(ui_dir):
    if not filename.endswith(".js"):
        continue
    filepath = os.path.join(ui_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Strip basic React.ComponentProps<...> and VariantProps<...>
    content = re.sub(r':\s*typeof\s+[a-zA-Z0-9_\.]+', '', content)
    content = re.sub(r':\s*React\.ComponentProps<[^>]+>', '', content)
    content = re.sub(r':\s*React\.HTMLAttributes<[^>]+>', '', content)
    content = re.sub(r'&\s*VariantProps<[^>]+>', '', content)
    content = re.sub(r'&\s*\{\s*inset\?:\s*boolean\s*\}', '', content)
    content = re.sub(r'&\s*\{\s*asChild\?:\s*boolean\s*\}', '', content)
    content = re.sub(r'import\s*\{\s*cva,\s*type\s*VariantProps\s*\}\s*from\s*"class-variance-authority"', 'import { cva } from "class-variance-authority"', content)
    
    # We might have left over &s or spaces before closing parentheses
    # But usually babel doesn't care about trailing whitespace.
    content = re.sub(r':\s*React\.ElementRef<[^>]+>', '', content)
    
    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filename}")

print("Done.")
