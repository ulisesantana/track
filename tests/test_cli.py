from unittest.mock import patch

import pytest
from click.testing import CliRunner

from tests.mocks import MockTrackCLI
from track.track import cli


@pytest.fixture
def runner():
    return CliRunner()


def test_restart(runner):
    with patch('track.track.track_cli', MockTrackCLI()):
        with runner.isolated_filesystem():
            result = runner.invoke(cli, ["continue"])

        assert result.output == "Continue command called.\n"
        assert result.exit_code == 0


def test_start(runner):
    with patch('track.track.track_cli', MockTrackCLI()):
        with runner.isolated_filesystem():
            result = runner.invoke(cli, ["start"])

        assert result.output == "Start command called.\n"
        assert result.exit_code == 0



def test_stop(runner):
    with patch('track.track.track_cli', MockTrackCLI()):
        with runner.isolated_filesystem():
            result = runner.invoke(cli, ["stop"])

        assert result.output == "Stop command called.\n"
        assert result.exit_code == 0


def test_current(runner):
    with patch('track.track.track_cli', MockTrackCLI()):
        with runner.isolated_filesystem():
            result = runner.invoke(cli, ["current"])

    assert result.output == "Current command called.\n"
    assert result.exit_code == 0


def test_today(runner):
    with patch('track.track.track_cli', MockTrackCLI()):
        with runner.isolated_filesystem():
            result = runner.invoke(cli, ["today"])

        assert result.output == "Today command called.\n"
        assert result.exit_code == 0


def test_week(runner):
    with patch('track.track.track_cli', MockTrackCLI()):
        with runner.isolated_filesystem():
            result = runner.invoke(cli, ["week"])

        assert result.output == "Week command called.\n"
        assert result.exit_code == 0
