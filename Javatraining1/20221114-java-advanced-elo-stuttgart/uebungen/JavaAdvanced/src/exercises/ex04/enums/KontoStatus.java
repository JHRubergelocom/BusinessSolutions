package exercises.ex04.enums;

public enum KontoStatus {
    ERÖFFNET(true, false),
    AKTIV(true, true),
    GESPERRT(true, false),
    GESCHLOSSEN(false, false);

    private boolean darfAbheben;
    private boolean darfEinzahlen;

    private KontoStatus(boolean darfEinzahlen, boolean darfAbheben){
        this.darfAbheben = darfAbheben;
        this.darfEinzahlen = darfEinzahlen;
    }

    public boolean isDarfAbheben() {
        return darfAbheben;
    }

    public boolean isDarfEinzahlen() {
        return darfEinzahlen;
    }
}
