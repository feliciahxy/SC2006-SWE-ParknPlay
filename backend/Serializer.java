import java.util.ArrayList;
import java.io.*; 

/**
 * Provides serialization and deserialization functionalities for objects of type {@code ArrayList<T>},
 * where {@code T} extends {@code Serializable}.
 * 
 * @param <T> The type of objects to be serialized and deserialized, must implement {@code Serializable}.
 */
public class Serializer<T extends Serializable> implements Serializable {
    private String filepath;  // The file path where serialized data is stored and read from.

    /**
     * Constructs a Serializer with a specified file path for storing and retrieving serialized data.
     *
     * @param filepath The path of the file used to store serialized data.
     */
    public Serializer(String filepath) {
        this.filepath = filepath;
    }

    /**
     * Deserializes an {@code ArrayList<T>} from the file specified by {@code filepath}.
     * 
     * @return The {@code ArrayList<T>} deserialized from the file, or {@code null} if the file does not contain an {@code ArrayList}.
     * @throws IOException If an I/O error occurs while reading from the file.
     * @throws ClassNotFoundException If the class of a serialized object cannot be found.
     */
    public ArrayList<T> deserialize() throws IOException, ClassNotFoundException {
        ObjectInputStream in = new ObjectInputStream(new FileInputStream(filepath));
        Object obj = in.readObject();
        in.close();
        if (obj instanceof ArrayList)
            return (ArrayList<T>) obj;
        return null;
    }

    /**
     * Serializes an {@code ArrayList<T>} and writes it to the file specified by {@code filepath}.
     *
     * @param TList The {@code ArrayList<T>} to be serialized.
     */
    public void serialize(ArrayList<T> TList) {
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(filepath))) {
            out.writeObject(TList);
        } catch (IOException e) {
            System.out.println("Error: I/O operation fails");
            e.printStackTrace();
        }
    }
}