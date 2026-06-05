import re
import sys

def main():
    file_path = "/Users/user/.gemini/antigravity/scratch/frontend/app/page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the header block
    header_start_str = "                {/* Header */}\n                <header"
    header_end_str = "                </header>"
    
    header_start_idx = content.find(header_start_str)
    header_end_idx = content.find(header_end_str, header_start_idx)
    
    if header_start_idx == -1 or header_end_idx == -1:
        print("Could not find header block")
        sys.exit(1)
        
    header_end_idx += len(header_end_str)
    
    header_content = content[header_start_idx:header_end_idx]
    
    # Remove header from its original place
    content = content[:header_start_idx] + content[header_end_idx:]
    
    # Now find where to insert it. We want to insert it after:
    #                 <main className="flex-1 overflow-y-auto relative w-full">
    
    main_str = '<main className="flex-1 overflow-y-auto relative w-full">'
    main_idx = content.find(main_str)
    
    if main_idx == -1:
        print("Could not find main element")
        sys.exit(1)
        
    insert_idx = main_idx + len(main_str)
    
    # Find the fixed background effects and move them too
    bg_effects_str = """            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]" />
            </div>"""
    
    bg_effects_idx = content.find(bg_effects_str)
    if bg_effects_idx != -1:
        # Remove them from original place
        content = content[:bg_effects_idx] + content[bg_effects_idx + len(bg_effects_str):]
        # Make it z-0
        bg_effects_str = bg_effects_str.replace('<div className="fixed inset-0 pointer-events-none">', '<div className="fixed inset-0 pointer-events-none z-0">')
    else:
        bg_effects_str = ""

    # Replace the container div for dashboard
    dashboard_container_str = '<div className="relative max-w-7xl mx-auto p-6 md:p-10 space-y-10">'
    content = content.replace(dashboard_container_str, '<div className="relative max-w-7xl mx-auto p-6 md:p-10 pt-6 space-y-10">')
    
    # Build the new header section
    new_header_section = f"""
{bg_effects_str}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-6 md:pt-10">
{header_content}
            </div>
            <div className="relative z-10">
"""
    
    # Insert new header section
    content = content[:insert_idx] + new_header_section + content[insert_idx:]
    
    # Since we added <div className="relative z-10"> we need to close it before the </main>
    # Find </main>
    main_close_idx = content.rfind("</main>")
    if main_close_idx != -1:
        content = content[:main_close_idx] + "            </div>\n" + content[main_close_idx:]
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Successfully moved header.")

if __name__ == "__main__":
    main()
