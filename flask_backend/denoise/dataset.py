from copy import deepcopy


class Dataset(object):
    def __init__(self):
        pass


class ImageDataset(Dataset):
    def __init__(self, name, description=""):
        self.name = name
        self.description = description
        self.load_path = None
        self.data = None

    def load_from_path(self, load_path):
        self.load_path = load_path
        pass

    def load_from_array(self, array):
        self.data = deepcopy(array)
