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
