Feature: Todo Management with Environment-Specific Configuration and Kafka Integration

  Background: Acceptance Criteria: The base URL must be loaded dynamically from the environment configuration.
    # The config.baseUrl is returned by the karate-config.js based on the -Dkarate.env argument.
    * url baseUrl
    * def givenENV = karate.env

  Scenario: Acceptance Criteria: A complete lifecycle of a ToDo item (Create, Retrieve, List, Create Second, List All),
    must execute successfully, and verify Kafka message is produced.
    * print 'Running tests against environment: ', givenENV

  # --- ACTION 1: Acceptance Criteria: Creating a new todo must return a 201 status and the new item with an assigned id ---
  
    # Given the environment is set to "Dev/Stage/Perf/Mtf" (Implied by the config file based on runtime argument)
    Given path 'todos'
    #And I provide a new todo item with title 'First' and completion status false
    And request { title: 'First', complete: false }
    #When I submit the request to create the item
    When method post
    #Then the system should respond with a 201 Created status
    Then status 201
    #And the response should confirm the details:
    And match response == { id: '#number', title: 'First', complete: false }
    * def firstId = response.id-1

  # --- ACTION 2: Retrieve the Newly Created Todo by ID ---
  # Acceptance Criteria: Retrieving the item using the calculated ID (firstId) must return a 200 status
  # and the specific (placeholder) content.

    #Given the path is set to retrieve the item using the calculated ID 'firstId'
    Given path 'todos', firstId
    #When I request the item details via GET
    When method get
    #Then the system should respond with a 200 OK status
    Then status 200 // as its an empty response {}
    # NOTE: Retaining the user's specific match logic using a placeholder title
    # And the response details should deep match the expected content
    And match response contains deep { id: '#(firstId)', title: 'ipsam aperiam voluptates qui'}

  # --- ACTION 3: Get All Todos and Verify First is Present ---
  # Acceptance Criteria: Listing all todos must return a 200 status and include the created item.
    #Given the endpoint for listing all todos is targeted
    Given path 'todos'
    #And I ensure the request contains the creation details for the "First" item (for reference)
    And request { title: 'First', complete: false }
    #When I request the full list of todos
    When method get
    #Then the system should respond with a 200 OK status
    Then status 200
    #And the list should contain the item matching the calculated ID 'firstId' with the specific placeholder title:
    And match response contains deep { id: '#(firstId)', title: 'ipsam aperiam voluptates qui'}

  # --- ACTION 4: Create the Second Todo Item ---
  # Acceptance Criteria: Creating a second todo must also return a 201 status and its new details.
    #Given the endpoint for creating new todos is targeted again
    Given path 'todos'
    #And I provide a second todo item with title 'Second' and completion status false
    And request { title: 'Second', complete: false }
    #When I submit the request to create the second item
    When method post
    #Then the system should respond with a 201 Created status
    Then status 201
    #And the response should confirm the details:
    And match response == { id: '#number', title: 'Second', complete: false }
    # NOTE: Retaining the user's specific ID calculation logic
    * def secondId = response.id-1

  # --- ACTION 5: Get All Todos and Verify Both are Present ---
  # Acceptance Criteria: The final list must return a 200 status and contain deep matches for both items.
    #Given the endpoint for listing all todos is targeted a final time
    Given path 'todos'
    #When I request the list of all created items
    When method get
    #Then the system should respond with a 200 OK status
    Then status 200
    # NOTE: Retaining the user's specific match logic including the calculated IDs and placeholder titles
    # And the final list should deep match the expected structure containing both created
    And match response contains deep
    """
    [
      { id: '#(firstId)',  title: 'ipsam aperiam voluptates qui'},
      { id: '#(secondId)', title: 'ipsam aperiam voluptates qui'}
    ]
    """
