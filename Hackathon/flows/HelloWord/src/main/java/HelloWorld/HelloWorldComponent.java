package HelloWorld;

import de.elo.ix.client.IXConnection;
import de.elo.ix.client.IndexValue;
import de.elo.ix.client.LockC;
import de.elo.ix.client.Sord;
import de.elo.ix.client.SordC;

import java.util.List;
import java.util.Map;

import com.elo.flows.api.components.annotations.Component;
import com.elo.flows.api.components.annotations.Service;

import byps.RemoteException;

import com.elo.flows.api.components.annotations.Connection;
import com.elo.flows.api.components.annotations.ConnectionRequired;

@Component(version = "1.0.0-SNAPSHOT", namespace = "HelloWorld", name = "HelloWord", displayName = "component.HelloWord.display.name")
public class HelloWorldComponent {

    @Connection
    IXConnection ixConnect;

    @Service(displayName = "com.elo.flows.helloworld.service")
    public HelloOutput myService(HelloInput obj) {
        HelloOutput result = new HelloOutput();
        result.setText("Hello World!");
        return result;
    }

	@Service(displayName = "Test Service")
    @ConnectionRequired
    public HelloOutput  myServiceWithConnection(HelloInput obj) throws RemoteException {
        Sord applicant = ixConnect.ix().checkoutSord(obj.getText(), SordC.mbAll, LockC.NO);

        List<Map<String, IndexValue>> aspectAssoc = applicant.getAspects().get("CONTACT");
        Map<String, IndexValue> aspect = aspectAssoc.get(0);
        IndexValue firstName = aspect.get("FIRST_NAME");
        applicant.setName(firstName.getStringValue());
        ixConnect.ix().checkinSord(applicant, SordC.mbAll, LockC.NO);

        HelloOutput result = new HelloOutput();
        result.setText("IX-Version: " + ixConnect.getImplVersion());
        return result;
    }
}