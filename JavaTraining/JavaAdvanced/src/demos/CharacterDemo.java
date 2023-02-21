package demos;

public class CharacterDemo {
    public static void main(String[] args) {
        char a = 'a';
        char b = (char)(a + 1);
        char c1 = '\u1234';
        String s = "hallo";
        s = s.substring(2,3);
        System.out.println(s);
    }
}
