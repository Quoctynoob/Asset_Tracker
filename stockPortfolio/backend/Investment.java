package quoc_a3.ePortfolio;

public class Investment {
    private String type;
    private String symbol;
    private String name;
    private int quantity;
    private double price;
    private double bookValue;

    public Investment(String type, String symbol, String name, int quantity, double price, double bookValue) {
        this.type = type;
        this.symbol = symbol;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.bookValue = bookValue;
    }

    public String getType() {
        return type;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }

    public double getBookValue() {
        return bookValue;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setBookValue(double bookValue) {
        this.bookValue = bookValue;
    }

    @Override
    public String toString() {
        return "Investment{" +
                "type='" + type + '\'' +
                ", symbol='" + symbol + '\'' +
                ", name='" + name + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", bookValue=" + bookValue +
                '}';
    }

    public double calculateGain() {
        return (price * quantity) - bookValue;
    }
}
