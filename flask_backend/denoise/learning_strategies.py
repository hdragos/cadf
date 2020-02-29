import tensorflow as tf


class LearningStrategy:
    def __init__(self):
        pass

    def schedule(self, epoch):
        pass


class StepLearningStrategy:
    def __init__(self, build_dict):
        self.initial_lr = build_dict["initial_lr"]
        self.steps = build_dict["steps"]

    def schedule(self, epoch):
        for step in self.steps[::-1]:
            if step["epoch"] < epoch:
                return step["new_lr"]
        return self.initial_lr

