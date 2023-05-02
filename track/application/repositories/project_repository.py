from abc import ABC, abstractmethod
from typing import Dict

from track.core import Project


class ProjectRepository(ABC):
    workspace_id: int

    @abstractmethod
    def get_projects(self) -> Dict[int, Project]:
        pass

    @abstractmethod
    def get_project_by_id(self, id: int) -> Project:
        pass

    @abstractmethod
    def get_project_by_name(self, name: str) -> Project:
        pass
