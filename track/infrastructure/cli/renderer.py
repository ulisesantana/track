from typing import Dict

from track.core import Project, TimeEntry, TimeEntryList
from track.core.helpers import TimeHelper


class Renderer:

    @staticmethod
    def render_time_entry(entry: TimeEntry, project: Project) -> str:
        return f"{entry} ({project.name})"

    @staticmethod
    def render_report(entries: TimeEntryList, projects_dict: Dict[int, Project]) -> str:
        report = TimeHelper.seconds_to_hms_string(entries.get_total_duration())
        for entry in entries.values:
            project = projects_dict[entry.pid]
            report += f"\n  - {Renderer.render_time_entry(entry, project)}"
        return report
