package quoc_a3.ePortfolio;

public class Stock extends Investment {
    public Stock(String symbol, String name, int quantity, double price, double bookValue) {
        super("stock", symbol, name, quantity, price, bookValue);
    }
}
