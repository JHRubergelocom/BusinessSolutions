package demos.generics;

public class NumberContainer <T extends Number> {
    private T number;

    public NumberContainer(T number) {
        this.number = number;
    }

    public void setNumber(T number) {
        this.number = number;
    }

    public T getNumber() {
        return number;
    }

    public int getIntValue() {
        return number.intValue();
    }

    public double getDoubleValue() {
        return number.doubleValue();
    }
}
