package quoc_a3.ePortfolio;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

/**
 * This class represents a simple ePortfolio application that allows the user to manage and track investments.
 * The user can add, update, sell, and search investments, as well as view total gains.
 */
public class Portfolio {

    /** List to store all investments. */
    private static ArrayList<Investment> investments = new ArrayList<>();
    private static JFrame frame;
    private static JTextArea textArea;

    /**
     * The entry point for the ePortfolio application.
     * Initializes the GUI and loads investment data from a file provided as a command-line argument.
     * 
     * @param args Command-line arguments; expects a single argument which is the filename for loading investments.
     */
    public static void main(String[] args) {
        // Initialize the GUI using the SwingUtilities.invokeLater method to ensure thread safety
        SwingUtilities.invokeLater(() -> {
            try {
                initializeGUI();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // Check if a filename is provided as a command-line argument
        if (args.length != 1) {
            JOptionPane.showMessageDialog(null, "Please provide a filename as a command line argument.");
            System.exit(0);
        }
    }

    /**
     * Initializes the graphical user interface (GUI) for the ePortfolio application.
     * Sets up the main frame, menu bar, and text area for displaying messages.
     */
    private static void initializeGUI() {
        // Create the main application frame
        frame = new JFrame("ePortfolio");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(600, 400);

        // Create the menu bar with different commands for the user
        JMenuBar menuBar = new JMenuBar();
        JMenu commandsMenu = new JMenu("Commands");
        menuBar.add(commandsMenu);

        // Define available commands
        String[] commands = {"Buy", "Sell", "Update", "GetGain", "Search", "Quit"};
        for (String command : commands) {
            JMenuItem menuItem = new JMenuItem(command);
            commandsMenu.add(menuItem);
            // Add action listener for each command
            menuItem.addActionListener(new MenuActionListener(command));
        }

        // Set the menu bar to the frame
        frame.setJMenuBar(menuBar);

        // Initialize the text area to display messages
        textArea = new JTextArea();
        textArea.setEditable(false);  // Prevent user from editing the text area
        textArea.setFont(new Font("Arial", Font.PLAIN, 14));
        textArea.setText("Welcome to ePortfolio!\n\n"
                + "Use the 'Commands' menu to manage your investments:\n"
                + "- Buy: Add a new investment.\n"
                + "- Sell: Sell an existing investment.\n"
                + "- Update: Update investment prices.\n"
                + "- GetGain: View your total gains.\n"
                + "- Search: Search for investments.\n"
                + "- Quit: Exit the application.");

        // Add the text area to the frame inside a scroll pane
        frame.add(new JScrollPane(textArea), BorderLayout.CENTER);

        // Make the frame visible
        frame.setVisible(true);
    }

    /**
     * This method provides the functionality to buy a new investment and add it to the portfolio.
     * It allows the user to specify the type (stock or mutual fund), symbol, name, quantity, and price
     * of the investment. The method validates the input, creates a new `Investment` object, and adds it
     * to the `investments` list. It also updates the `textArea` with appropriate success or error messages.
     */
    private static void buy() {
        // Create the main panel for the buy operation
        JPanel buyPanel = new JPanel(new FlowLayout());
        frame.getContentPane().removeAll();
        frame.getContentPane().add(buyPanel);

        // Input panel for collecting investment details
        JPanel inputPanel = new JPanel(new FlowLayout());
        buyPanel.add(inputPanel);

        // ComboBox for selecting the investment type (stock or mutualfund)
        JComboBox<String> typeComboBox = new JComboBox<>(new String[]{"stock", "mutualfund"});
        inputPanel.add(new JLabel("Type:"));
        inputPanel.add(typeComboBox);

        // Text field for entering the symbol of the investment
        JTextField symbolField = new JTextField(15);
        inputPanel.add(new JLabel("Symbol:"));
        inputPanel.add(symbolField);

        // Text field for entering the name of the investment
        JTextField nameField = new JTextField(15);
        inputPanel.add(new JLabel("Name:"));
        inputPanel.add(nameField);

        // Text field for entering the quantity of the investment
        JTextField quantityField = new JTextField(15);
        inputPanel.add(new JLabel("Quantity:"));
        inputPanel.add(quantityField);

        // Text field for entering the price of the investment
        JTextField priceField = new JTextField(15);
        inputPanel.add(new JLabel("Price:"));
        inputPanel.add(priceField);

        // Panel for buttons (Reset and Buy)
        JPanel buttonsPanel = new JPanel(new FlowLayout());
        buyPanel.add(buttonsPanel, BorderLayout.SOUTH);

        // Reset button to clear all input fields and textArea
        JButton resetButton = new JButton("Reset");
        resetButton.addActionListener(e -> {
            symbolField.setText("");
            nameField.setText("");
            quantityField.setText("");
            priceField.setText("");
            textArea.setText("");
        });
        buttonsPanel.add(resetButton);

        // Buy button to add a new investment to the portfolio
        JButton buyButton = new JButton("Buy");
        buyButton.addActionListener(e -> {
            String type = (String) typeComboBox.getSelectedItem();
            String symbol = symbolField.getText().trim();
            String name = nameField.getText().trim();
            String quantityText = quantityField.getText().trim();
            String priceText = priceField.getText().trim();

            // Check if any field is empty
            if (symbol.isEmpty() || name.isEmpty() || quantityText.isEmpty() || priceText.isEmpty()) {
                textArea.setText("Error: All fields must be filled out.");
                return;
            }

            try {
                // Parse the quantity and price fields
                int quantity = Integer.parseInt(quantityText);
                double price = Double.parseDouble(priceText);

                // Create a new investment and add it to the list
                Investment newInvestment = new Investment(type, symbol, name, quantity, price, price * quantity);
                investments.add(newInvestment);

                // Display success message
                textArea.setText("Successfully added " + type + " investment:\n"
                        + "Symbol: " + symbol + "\n"
                        + "Name: " + name + "\n"
                        + "Quantity: " + quantity + "\n"
                        + "Price: " + price);
            } catch (NumberFormatException ex) {
                // Handle invalid input for quantity or price
                textArea.setText("Error: Quantity and Price must be valid numbers.");
            }
        });
        buttonsPanel.add(buyButton);

        // Set up the text area for displaying messages
        textArea = new JTextArea(5, 50);
        textArea.setEditable(false);
        textArea.setBorder(BorderFactory.createTitledBorder("Messages"));
        buyPanel.add(new JScrollPane(textArea), BorderLayout.SOUTH);

        // Refresh the frame to display the changes
        frame.revalidate();
        frame.repaint();
    }

    /**
     * This method provides the functionality to sell a specified quantity of an existing investment from the portfolio.
     * It allows the user to enter the symbol and quantity of the investment they want to sell. The method validates 
     * the input, finds the investment in the `investments` list, and updates or removes the investment accordingly. 
     * The `textArea` is updated with success or error messages.
     */
    private static void sell() {
        // Create the main panel for the sell operation
        JPanel sellPanel = new JPanel(new FlowLayout());
        frame.getContentPane().removeAll();
        frame.getContentPane().add(sellPanel);

        // Input panel for collecting investment details
        JPanel inputPanel = new JPanel(new FlowLayout());
        sellPanel.add(inputPanel);

        // Text field for entering the symbol of the investment
        JTextField symbolField = new JTextField(15);
        inputPanel.add(new JLabel("Symbol:"));
        inputPanel.add(symbolField);

        // Text field for entering the quantity to sell
        JTextField quantityField = new JTextField(15);
        inputPanel.add(new JLabel("Quantity to sell:"));
        inputPanel.add(quantityField);

        // Panel for buttons (Reset and Sell)
        JPanel buttonsPanel = new JPanel(new FlowLayout());
        sellPanel.add(buttonsPanel, BorderLayout.SOUTH);

        // Reset button to clear input fields and textArea
        JButton resetButton = new JButton("Reset");
        resetButton.addActionListener(e -> {
            symbolField.setText("");
            quantityField.setText("");
            textArea.setText("");
        });
        buttonsPanel.add(resetButton);

        // Sell button to remove or update the investment
        JButton sellButton = new JButton("Sell");
        sellButton.addActionListener(e -> {
            String symbol = symbolField.getText().trim();
            String quantityText = quantityField.getText().trim();

            // Check if any field is empty
            if (symbol.isEmpty() || quantityText.isEmpty()) {
                textArea.setText("Error: All fields must be filled out.");
                return;
            }

            try {
                // Parse the quantity to sell
                int quantity = Integer.parseInt(quantityText);
                boolean sold = false;

                // Search for the investment in the list
                for (Investment investment : investments) {
                    if (investment.getSymbol().equalsIgnoreCase(symbol)) {
                        // Check if the investment has enough quantity to sell
                        if (investment.getQuantity() >= quantity) {
                            investment.setQuantity(investment.getQuantity() - quantity);
                            sold = true;

                            // Remove the investment if the quantity is 0
                            if (investment.getQuantity() == 0) {
                                investments.remove(investment);
                            }

                            // Display success message
                            textArea.setText("Successfully sold " + quantity + " of " + symbol + ".");
                            break;
                        } else {
                            // Display error if not enough quantity to sell
                            textArea.setText("Error: Not enough quantity to sell.");
                            return;
                        }
                    }
                }

                // If investment was not found
                if (!sold) {
                    textArea.setText("Error: Investment not found.");
                }
            } catch (NumberFormatException ex) {
                // Handle invalid input for quantity
                textArea.setText("Error: Quantity must be a valid number.");
            }
        });
        buttonsPanel.add(sellButton);

        // Set up the text area for displaying messages
        textArea = new JTextArea(5, 50);
        textArea.setEditable(false);
        textArea.setBorder(BorderFactory.createTitledBorder("Messages"));
        sellPanel.add(new JScrollPane(textArea), BorderLayout.SOUTH);

        // Refresh the frame to display the changes
        frame.revalidate();
        frame.repaint();
    }


    /**
     * This method provides the functionality to update the price of an existing investment in the portfolio.
     * It allows the user to enter the symbol of the investment and the new price they want to set.
     * The method validates the input, searches for the investment in the `investments` list, and updates its price.
     * A success or error message is displayed in the `textArea` based on the result.
     */
    private static void update() {
        // Create the main panel for the update operation
        JPanel updatePanel = new JPanel(new FlowLayout());
        frame.getContentPane().removeAll();
        frame.getContentPane().add(updatePanel);

        // Input panel for collecting investment symbol and new price
        JPanel inputPanel = new JPanel(new FlowLayout());
        updatePanel.add(inputPanel);

        // Text field for entering the symbol of the investment
        JTextField symbolField = new JTextField(15);
        inputPanel.add(new JLabel("Symbol:"));
        inputPanel.add(symbolField);

        // Text field for entering the new price of the investment
        JTextField priceField = new JTextField(15);
        inputPanel.add(new JLabel("New Price:"));
        inputPanel.add(priceField);

        // Panel for buttons (Reset and Update)
        JPanel buttonsPanel = new JPanel(new FlowLayout());
        updatePanel.add(buttonsPanel, BorderLayout.SOUTH);

        // Reset button to clear input fields and textArea
        JButton resetButton = new JButton("Reset");
        resetButton.addActionListener(e -> {
            symbolField.setText("");
            priceField.setText("");
            textArea.setText("");
        });
        buttonsPanel.add(resetButton);

        // Update button to update the price of the specified investment
        JButton updateButton = new JButton("Update");
        updateButton.addActionListener(e -> {
            String symbol = symbolField.getText().trim();
            String priceText = priceField.getText().trim();

            // Check if any of the fields are empty
            if (symbol.isEmpty() || priceText.isEmpty()) {
                textArea.setText("Error: All fields must be filled out.");
                return;
            }

            try {
                // Parse the new price
                double newPrice = Double.parseDouble(priceText);
                boolean updated = false;

                // Search for the investment and update its price
                for (Investment investment : investments) {
                    if (investment.getSymbol().equalsIgnoreCase(symbol)) {
                        investment.setPrice(newPrice);
                        textArea.setText("Successfully updated price for " + symbol + " to " + newPrice);
                        updated = true;
                        break;
                    }
                }

                // If the investment was not found, display an error message
                if (!updated) {
                    textArea.setText("Error: Investment not found.");
                }
            } catch (NumberFormatException ex) {
                // Handle invalid price input
                textArea.setText("Error: Price must be a valid number.");
            }
        });
        buttonsPanel.add(updateButton);

        // Set up the text area for displaying messages
        textArea = new JTextArea(5, 50);
        textArea.setEditable(false);
        textArea.setBorder(BorderFactory.createTitledBorder("Messages"));
        updatePanel.add(new JScrollPane(textArea), BorderLayout.SOUTH);

        // Refresh the frame to display the changes
        frame.revalidate();
        frame.repaint();
    }


    private static void getGain() {
        //Haven't Finished
    }

    /**
     * This method creates a search interface that allows the user to search for an investment
     * by its symbol. It includes input fields for the symbol and displays search results
     * in a non-editable text area.
     */
    private static void search() {
        // Create the main panel for search functionality
        JPanel searchPanel = new JPanel(new FlowLayout());
        frame.getContentPane().removeAll();
        frame.getContentPane().add(searchPanel);

        // Input panel for entering the symbol to search for
        JPanel inputPanel = new JPanel(new FlowLayout());
        searchPanel.add(inputPanel);

        // Text field for entering the symbol to search for
        JTextField searchField = new JTextField(15);
        inputPanel.add(new JLabel("Search Symbol:"));
        inputPanel.add(searchField);

        // Panel for buttons (Reset and Search)
        JPanel buttonsPanel = new JPanel(new FlowLayout());
        searchPanel.add(buttonsPanel, BorderLayout.SOUTH);

        // Reset button to clear the input field and result area
        JButton resetButton = new JButton("Reset");
        resetButton.addActionListener(e -> {
            searchField.setText("");
            textArea.setText("");
        });
        buttonsPanel.add(resetButton);

        // Text area for displaying search results
        JTextArea resultArea = new JTextArea(5, 50);
        resultArea.setEditable(false);
        resultArea.setBorder(BorderFactory.createTitledBorder("Messages"));
        JScrollPane scrollPane = new JScrollPane(resultArea);
        searchPanel.add(scrollPane, BorderLayout.CENTER);

        // Search button to perform the search
        JButton searchButton = new JButton("Search");
        searchButton.addActionListener(e -> {
            String symbol = searchField.getText().trim();
            if (symbol.isEmpty()) {
                resultArea.setText("Error: Please enter a symbol to search.");
                return;
            }

            // StringBuilder to accumulate search results
            StringBuilder resultText = new StringBuilder("Search Results for: " + symbol + "\n");
            boolean found = false;

            // Loop through the investments and search for the given symbol
            for (Investment investment : investments) {
                if (investment.getSymbol().equalsIgnoreCase(symbol)) {
                    resultText.append(investment.toString()).append("\n");
                    found = true;
                }
            }

            // If no investment was found, append the appropriate message
            if (!found) {
                resultText.append("No investment found with the symbol: ").append(symbol);
            }

            // Display the search results in the result area
            resultArea.setText(resultText.toString());
        });
        buttonsPanel.add(searchButton);

        // Refresh the frame to display the updated search panel
        frame.revalidate();
        frame.repaint();
    }

    /**
     * This class listens for actions performed on menu items. It maps each menu item command to 
     * the corresponding method to be executed. The actionPerformed method handles the menu item
     * selection and triggers the appropriate functionality (e.g., Buy, Sell, Update, etc.).
     */
    static class MenuActionListener implements ActionListener {
        private final String command;

        /**
         * Constructor for the MenuActionListener. It accepts a command that represents 
         * the menu item that was selected.
         *
         * @param command The command associated with the selected menu item (e.g., "Buy", "Sell", etc.)
         */
        public MenuActionListener(String command) {
            this.command = command;
        }

        /**
         * This method is called when a menu item is selected. Based on the command,
         * it triggers the corresponding action (e.g., Buy, Sell, Update, etc.).
         * 
         * @param e The ActionEvent triggered by the menu item selection.
         */
        @Override
        public void actionPerformed(ActionEvent e) {
            switch (command) {
                case "Buy":
                    buy();
                    break;
                case "Sell":
                    sell();
                    break;
                case "Update":
                    update();
                    break;
                case "GetGain":
                    getGain();
                    break;
                case "Search":
                    search();
                    break;
                case "Quit":
                    System.exit(0);
                    break;
                default:
                    break;
            }
        }
    }
}