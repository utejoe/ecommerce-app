import os

# Folders to completely ignore
IGNORED_DIRS = {
    '__pycache__', '.git', '.env', 'env', 'node_modules', 'dist', 'build',
    '.next', '.cache', '.vscode', 'assets', 'upload', 'images', 'media', 'static'
}

# Files to ignore by exact name
IGNORED_FILES = {
    'package-lock.json', 'yarn.lock', '.DS_Store', 'list_structure.py', 'list_structure.txt',
    'bash.exe.stackdump'
}

# File extensions to ignore (media/assets)
IGNORED_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico', '.mp4', '.webm', '.mp3', '.wav'
}

# Limit recursion depth
MAX_DEPTH = 3

def should_ignore(item, path):
    if item in IGNORED_FILES:
        return True
    if os.path.isdir(path) and item in IGNORED_DIRS:
        return True
    if os.path.isfile(path):
        ext = os.path.splitext(item)[1].lower()
        if ext in IGNORED_EXTENSIONS:
            return True
    return False

def print_structure(start_path, indent="", depth=0, file=None):
    if depth > MAX_DEPTH:
        return

    try:
        items = sorted(os.listdir(start_path))
    except (PermissionError, FileNotFoundError):
        line = indent + "|-- [Permission Denied or Not Found]\n"
        (file.write(line) if file else print(line, end=""))
        return

    for item in items:
        path = os.path.join(start_path, item)
        if should_ignore(item, path):
            continue

        line = indent + "|-- " + item + "\n"
        (file.write(line) if file else print(line, end=""))

        if os.path.isdir(path):
            print_structure(path, indent + "    ", depth + 1, file)

if __name__ == "__main__":
    base = os.path.expanduser("~/Desktop/software_work/projects")
    folder = "How_To_Create_Full_Stack_E-Commerce_Website_Using_React_JS_MongoDB_Express_Node_JS_2024/E-commerce"
    project_root = os.path.abspath(os.path.join(base, folder))
    project_name = os.path.basename(project_root)

    print(f"Project Structure: {project_name}\n")

    if not os.path.exists(project_root):
        print("❌ Error: Path does not exist.")
    else:
        output_file = "list_structure.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(f"Project Structure: {project_name}\n\n")
            print_structure(project_root, file=f)
        print(f"✅ Clean project structure written to {output_file}")
