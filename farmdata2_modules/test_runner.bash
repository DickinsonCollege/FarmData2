#!/bin/bash

cd ~/fd2test

if [[ $# == 0 ]];
then
    echo "Running Cypress Testing GUI"
    npx cypress open &> /dev/null
fi

if [[ "$1" != "e2e" && "$1" != "ct" && "$1" != "all" ]];
then
  echo "Usage: test_runner.bash [<arg> [<browser>]]"
  echo "  Run the Cypress test suite."
  echo "    <arg>:"
  echo "      If no <arg> is provided the Cypress GUI test runner will be opened."
  echo "      If <arg> is provided the valid values are:"
  echo "        e2e - to run the end to end tests headless (*.spec.js)."
  echo "        ct  - to run the component tests headless (*.spec.comp.js)."
  echo "        all - to run both the end-to-end and component tests in sequence."
  echo "    <browser>:"
  echo "       Ignored if no arg is provided."
  echo "       If no <browser> is specified the default Electron browser will be used."
  echo "       <browser> may be any valid browser for Cypress testing."
  echo "         electron | firefox | chrome"
  exit -1
fi

BROWSER=""
if [[ $# == 2 ]];
then
  BROWSER="--browser $2"
fi

if [[ "$1" == "e2e" ]];
then
    echo "Running e2e Tests"
    npx cypress run --e2e $BROWSER
elif [[ "$1" == "ct" ]];
then
    echo "Running Component Tests"
    npx cypress run --component $BROWSER
else
    echo "Running all tests"
    npx cypress run --component $BROWSER
    npx cypress run --e2e $BROWSER
fi
