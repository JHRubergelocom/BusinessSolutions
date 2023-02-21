package demos.generics;

public class Container <T>{
    private T data;

    public Container(T data) {
        this.data = data;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public static void main(String[] args) {
        Container<String> stringContainer = new Container<>("Hallo");
        stringContainer.setData("Hallo");
        String data1 = stringContainer.getData();

        Container<Integer> intContainer = new Container<>(10);
        intContainer.setData(23);
        Integer data2 = intContainer.getData();
    }
}
