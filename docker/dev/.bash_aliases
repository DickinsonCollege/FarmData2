# Bash aliases that are installed into the dev container.

# Shutdown FarmData2
alias fd2-down="cd ~/FarmData2/docker && ./fd2-down.bash"

# Change the database used for FarmData2
setDB ()
{
  cd ~/FarmData2/docker
  ./setDB.bash $1
}

# Clear the drupal cache in the fd2_farmdata2 container.
alias clearDupalCache="docker exec -it fd2_farmdata2 drush cc all"

# Alias code for running VSCode with no-sandbox.
code ()
{
  /usr/bin/code --no-sandbox $@
}

# Aliases for the testing scripts
alias guitest="cd ~/FarmData2/farmdata2_modules && ./test_runner.bash"
alias e2etests="cd ~/FarmData2/farmdata2_modules && ./test_runner.bash e2e"
alias ctests="cd ~/FarmData2/farmdata2_modules && ./test_runner.bash ct"
alias alltests="cd ~/FarmData2/farmdata2_modules && ./test_runner.bash all"
