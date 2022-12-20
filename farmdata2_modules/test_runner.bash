#!/bin/bash

cd ~/fd2test

if [[ $# == 0 ]];
then
    echo "Running Cypress Testing GUI"
    npx cypress open &> /dev/null
    exit 0
fi

if [[ "$1" != "e2e" && "$1" != "ct" && "$1" != "all" ]];
then
  echo "Usage: test_runner.bash [<type> [<args>]]"
  echo "  Run the Cypress test suite."
  echo "    <type>:"
  echo "      If no <type> is provided the Cypress GUI test runner will be opened."
  echo "      If <type> is provided the terminal-based Cypress test runner is used:"
  echo "        e2e - to run the end to end tests headless (*.spec.js)."
  echo "        ct  - to run the component tests headless (*.spec.comp.js)."
  echo "        all - to run both the end-to-end and component tests in sequence."
  echo "    <args>:"
  echo "       Ignored if no <type> is provided."
  echo "       Otherwise, all remaining <args> are passed directly to cypress run."
  echo "         Several useful <args> include:"
  echo "           --browser <electron | firefox | chrome | chromium | ...>"
  echo "           --spec <blob>"
  echo "             e.g. --spec \"**/fd2_example/ui/*.spec.js\""
  echo "             e.g. --spec \"**/fd2_field_kit/**/*.spec.js\""
  exit -1
fi

ARGS=${@:2}

if [[ "$1" == "e2e" ]];
then
    echo "Running e2e Tests"
    npx cypress run --e2e $ARGS
elif [[ "$1" == "ct" ]];
then
    echo "Running Component Tests"
    npx cypress run --component $ARGS
else
    echo "Running all tests"
    npx cypress run --component $ARGS
    npx cypress run --e2e $ARGS
fi
