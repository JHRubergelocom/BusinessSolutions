package demos;

enum AccountStatus {
    CREATED(true, false),
    ACTIVE(true, true),
    CLOSED(false, true),
    LOCKED(false, false);

    private boolean darfAbheben;
    private boolean darfEinzahlen;

    AccountStatus(boolean darfEinzahlen, boolean darfAbheben) {
        this.darfEinzahlen = darfEinzahlen;
        this.darfAbheben = darfAbheben;
    }

    public boolean isDarfAbheben() {
        return darfAbheben;
    }

    public boolean isDarfEinzahlen() {
        return darfEinzahlen;
    }
}
public class Account {
    private AccountStatus status;
    
    public static void main(String[] args) {
        Account ac = new Account();
        ac.status = AccountStatus.ACTIVE;
        System.out.println(ac.status.isDarfAbheben());
    }

}
