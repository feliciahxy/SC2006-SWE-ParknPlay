import java.io.Serializable;
import java.util.ArrayList;

/**
 * A generic interface for data management operations that can be applied to any type of serializable data object.
 * 
 */
public interface IDataManager<T1 extends Serializable, T2> extends Serializable {

    /**
     * Updates an existing entry in the data management system with the provided object.
     * This method would replace an existing object with the new object provided, based on an identifier or key.
     *
     * @param newT1 The new object to replace the existing object.
     */
    void update(T1 newT1);

    /**
     * Adds a new object to the data management system.
	 * 
     * @param t1 The object to be added to the system.
     */
    void add(T1 t1);

    /**
     * Deletes a specific object from the data management system.
     * 
     *
     * @param t1 The object to be deleted from the system.
     */
    void delete(T1 t1);

    /**
     * Finds and returns an object by its identifier.
     *
     * @param t2 The identifier used to find the object.
     * @return The object found if no such object exists.
     */
    T1 find(T2 t2);

    /**
     * Retrieves all objects of type {@code T1} from the data management system.
     *
     * @return An {@link ArrayList} of all objects of type {@code T1} currently managed by the system.
     */
    ArrayList<T1> getAll();
}