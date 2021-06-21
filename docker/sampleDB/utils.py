# The username and password for the authorized basic authentication user
# See addPeople.bash.
user='restws1'
passwd='farmdata2'

# Skip blank lines and drop all comments.
def decomment(csvfile):
    for row in csvfile:
        raw = row.split('#')[0].strip()
        if raw: yield raw