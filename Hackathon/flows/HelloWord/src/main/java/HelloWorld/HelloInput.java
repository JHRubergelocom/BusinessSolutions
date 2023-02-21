package HelloWorld;

import com.elo.flows.api.schema.annotations.Property;

public class HelloInput {

    @Property(displayName = "Hallo Jan")
    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

}