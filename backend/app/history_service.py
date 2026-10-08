import json
from pathlib import Path
from typing import List, Dict, Any, Optional

RESULTS_DIR = Path(__file__).resolve().parent.parent.parent / "results"
HISTORY_FILE = RESULTS_DIR / "history.json"


class HistoryService:
    def __init__(self):
        self._history: Dict[str, Dict[str, Any]] = {}
        self._load_history()

    def _load_history(self):
        if HISTORY_FILE.exists():
            try:
                with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        self._history = data
            except Exception:
                self._history = {}

    def _save_history(self):
        try:
            RESULTS_DIR.mkdir(parents=True, exist_ok=True)
            with open(HISTORY_FILE, "w", encoding="utf-8") as f:
                json.dump(self._history, f, indent=2)
        except Exception:
            pass

    def add_or_update(self, scan_data: Dict[str, Any]):
        scan_id = scan_data["scan_id"]
        self._history[scan_id] = scan_data
        self._save_history()

    def get_scan(self, scan_id: str) -> Optional[Dict[str, Any]]:
        return self._history.get(scan_id)

    def get_all_scans(self) -> List[Dict[str, Any]]:
        # Sort by start_time descending
        scans = list(self._history.values())
        scans.sort(key=lambda x: x.get("start_time", ""), reverse=True)
        return scans


history_store = HistoryService()
