class MockTrackCLI():

    def restart(self):
        print("Continue command called.")

    def start(self, description, project):
        print("Start command called.")

    def stop(self):
        print("Stop command called.")

    def current(self):
        print("Current command called.")

    def today(self):
        print("Today command called.")

    def week(self):
        print("Week command called.")
