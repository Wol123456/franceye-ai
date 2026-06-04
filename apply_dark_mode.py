import re

file_path = "frontend/app/page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Negative lookbehind to prevent double replacements: (?<!dark:)
replacements = {
    r"(?<!dark:)text-white": "text-slate-900 dark:text-white",
    r"(?<!dark:)text-slate-400": "text-slate-600 dark:text-slate-400",
    r"(?<!dark:)text-slate-300": "text-slate-700 dark:text-slate-300",
    r"(?<!dark:)text-slate-200": "text-slate-800 dark:text-slate-200",
    r"(?<!dark:)text-blue-400": "text-blue-600 dark:text-blue-400",
    
    r"(?<!dark:)bg-slate-900/80": "bg-slate-100/90 dark:bg-slate-900/80",
    r"(?<!dark:)bg-slate-900/50": "bg-slate-100/50 dark:bg-slate-900/50",
    r"(?<!dark:)bg-slate-900": "bg-slate-100 dark:bg-slate-900",
    
    r"(?<!dark:)bg-slate-800/80": "bg-white/80 dark:bg-slate-800/80",
    r"(?<!dark:)bg-slate-800/60": "bg-slate-50/60 dark:bg-slate-800/60",
    r"(?<!dark:)bg-slate-800/50": "bg-white/80 dark:bg-slate-800/50",
    r"(?<!dark:)bg-slate-800/40": "bg-white/80 dark:bg-slate-800/40",
    r"(?<!dark:)bg-slate-800": "bg-white dark:bg-slate-800",
    
    r"(?<!dark:)bg-slate-700/50": "bg-slate-200/50 dark:bg-slate-700/50",
    r"(?<!dark:)bg-slate-700": "bg-slate-200 dark:bg-slate-700",
    
    r"(?<!dark:)bg-\[\#020617\]": "bg-slate-50 dark:bg-[#020617]",
    
    r"(?<!dark:)border-white/10": "border-slate-300 dark:border-white/10",
    r"(?<!dark:)border-white/5": "border-slate-200 dark:border-white/5",
    r"(?<!dark:)border-slate-700/50": "border-slate-300/50 dark:border-slate-700/50",
    r"(?<!dark:)border-slate-700": "border-slate-300 dark:border-slate-700",
    
    r"(?<!dark:)hover:bg-slate-800/70": "hover:bg-slate-100/70 dark:hover:bg-slate-800/70",
    r"(?<!dark:)hover:bg-slate-800/60": "hover:bg-slate-100/60 dark:hover:bg-slate-800/60",
    r"(?<!dark:)hover:bg-slate-800": "hover:bg-slate-100 dark:hover:bg-slate-800",
    r"(?<!dark:)hover:bg-slate-700": "hover:bg-slate-200 dark:hover:bg-slate-700",
    r"(?<!dark:)hover:text-white": "hover:text-slate-900 dark:hover:text-white",
}

for pattern, replacement in replacements.items():
    content = re.sub(pattern, replacement, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Transform applied successfully.")
